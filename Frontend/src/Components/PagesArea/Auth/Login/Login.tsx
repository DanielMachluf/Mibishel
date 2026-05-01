import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../../Services/AuthService";
import { authStore } from "../../../../store/authStore";
import { notify } from "../../../../Utils/Notify";
import logo from "../../../../assets/logo.svg";
import "./Login.css";

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const token = await authService.login({ email, password });
            authStore.login(token);
            notify.success("Welcome back to Dishshare.");
            navigate("/dashboard");
        }
        catch (err: unknown) {
            const message = extractErrorMessage(err);
            setError(message);
            notify.error(err);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="Login">
            <form className="Login__card" onSubmit={submit}>
                <Link to="/" className="brand-logo Login__logo">
                    <span className="brand-logo__mark" aria-hidden="true">
                        <img src={logo} alt="" />
                    </span>
                    <span className="brand-logo__word">Dish<span className="brand-logo__accent">s</span>hare</span>
                </Link>
                <h1>Welcome back</h1>
                <p>Sign in to your saved recipe collection.</p>

                {error && <p className="form-error">{error}</p>}

                <label className="Login__field">
                    <span>Email</span>
                    <input
                        type="email"
                        value={email}
                        placeholder="you@example.com"
                        autoComplete="email"
                        onChange={event => setEmail(event.target.value)}
                        required
                    />
                </label>

                <label className="Login__field">
                    <span>Password</span>
                    <input
                        type="password"
                        value={password}
                        placeholder="Your password"
                        autoComplete="current-password"
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </label>

                <button className="primary-button Login__submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Login"}
                </button>

                <p className="Login__switch">
                    New to Dishshare? <Link to="/register">Create an account</Link>
                </p>
            </form>
        </div>
    );
}

function extractErrorMessage(err: unknown): string {
    if (typeof err === "object" && err !== null) {
        const maybeError = err as { response?: { data?: unknown }, message?: unknown };
        if (typeof maybeError.response?.data === "string") return maybeError.response.data;

        const data = maybeError.response?.data;
        if (typeof data === "object" && data !== null) {
            const message = (data as { message?: unknown }).message;
            if (typeof message === "string") return message;
        }

        if (typeof maybeError.message === "string") return maybeError.message;
    }

    return "Login failed. Please try again.";
}
