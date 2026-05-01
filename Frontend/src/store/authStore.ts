import { useSyncExternalStore } from "react";
import type { UserModel } from "../Models/user-model";

interface AuthState {
    token: string | null;
    user: UserModel | null;
}

interface TokenPayload {
    user?: UserModel;
    exp?: number;
}

type AuthListener = () => void;

const tokenKey = "token";
const listeners = new Set<AuthListener>();
let logoutTimer: number | null = null;

function clearLogoutTimer(): void {
    if (logoutTimer !== null) {
        window.clearTimeout(logoutTimer);
        logoutTimer = null;
    }
}

function decodePayload(token: string): TokenPayload | null {
    try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) return null;

        const normalizedPayload = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(normalizedPayload)) as TokenPayload;
    }
    catch {
        return null;
    }
}

function isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const payload = decodePayload(token);
    if (!payload || typeof payload.exp !== "number") return true;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowInSeconds;
}

function scheduleTokenExpiryLogout(token: string | null): void {
    clearLogoutTimer();
    if (!token) return;

    const payload = decodePayload(token);
    if (!payload || typeof payload.exp !== "number") return;

    const msUntilExpiry = payload.exp * 1000 - Date.now();
    if (msUntilExpiry <= 0) return;

    logoutTimer = window.setTimeout(() => {
        authStore.logout();
    }, msUntilExpiry);
}

function decodeToken(token: string | null): UserModel | null {
    if (!token) return null;

    const payload = decodePayload(token);
    return payload?.user ?? null;
}

function createState(): AuthState {
    const token = localStorage.getItem(tokenKey);
    if (isTokenExpired(token)) {
        localStorage.removeItem(tokenKey);
        return {
            token: null,
            user: null
        };
    }

    scheduleTokenExpiryLogout(token);
    return {
        token,
        user: decodeToken(token)
    };
}

let state = createState();

function emitChange(): void {
    listeners.forEach(listener => listener());
}

function subscribe(listener: AuthListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot(): AuthState {
    return state;
}

export const authStore = {
    login(token: string): void {
        if (isTokenExpired(token)) {
            this.logout();
            return;
        }

        localStorage.setItem(tokenKey, token);
        state = {
            token,
            user: decodeToken(token)
        };
        scheduleTokenExpiryLogout(token);
        emitChange();
    },

    logout(): void {
        clearLogoutTimer();
        localStorage.removeItem(tokenKey);
        state = {
            token: null,
            user: null
        };
        emitChange();
    },

    getToken(): string | null {
        if (isTokenExpired(state.token)) {
            this.logout();
            return null;
        }
        return state.token;
    },

    isLoggedIn(): boolean {
        if (isTokenExpired(state.token)) {
            this.logout();
            return false;
        }

        return Boolean(state.token);
    }
};

export function useAuthStore(): AuthState {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
