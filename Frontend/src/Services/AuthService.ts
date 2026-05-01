import axios from "axios";
import { appConfig } from "../Utils/AppConfig";

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterDetails extends LoginCredentials {
    firstName: string;
    lastName: string;
}

class AuthService {
    public async login(credentials: LoginCredentials): Promise<string> {
        const response = await axios.post<string>(`${appConfig.apiUrl}/login`, credentials);
        return response.data;
    }

    public async register(details: RegisterDetails): Promise<string> {
        const response = await axios.post<string>(`${appConfig.apiUrl}/register`, details);
        return response.data;
    }
}

export const authService = new AuthService();
