import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../../Services/AuthService";
import { authStore } from "../../../../store/authStore";
import { notify } from "../../../../Utils/Notify";
import logo from "../../../../assets/logo.svg";
import "./Register.css";

export function Register() {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const token = await authService.register({ firstName, lastName, email, password });
            authStore.login(token);
            notify.success("Your Dishshare cookbook is ready.");
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
        <div className="Register">
            <form className="Register__card" onSubmit={submit}>
                <Link to="/" className="brand-logo Register__logo">
                    <span className="brand-logo__mark" aria-hidden="true">
                        <img src={logo} alt="" />
                    </span>
                    <span className="brand-logo__word">Dishshare</span>
                </Link>
                <h1>Create your cookbook</h1>
                <p>Save social recipes in a kitchen-friendly collection.</p>

                {error && <p className="form-error">{error}</p>}

                <div className="Register__nameGrid">
                    <label className="Register__field">
                        <span>First name</span>
                        <input
                            value={firstName}
                            placeholder="Maya"
                            autoComplete="given-name"
                            onChange={event => setFirstName(event.target.value)}
                            required
                        />
                    </label>

                    <label className="Register__field">
                        <span>Last name</span>
                        <input
                            value={lastName}
                            placeholder="Cohen"
                            autoComplete="family-name"
                            onChange={event => setLastName(event.target.value)}
                            required
                        />
                    </label>
                </div>

                <label className="Register__field">
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

                <label className="Register__field">
                    <span>Password</span>
                    <input
                        type="password"
                        value={password}
                        placeholder="Choose a password"
                        autoComplete="new-password"
                        onChange={event => setPassword(event.target.value)}
                        required
                    />
                </label>

                <button className="primary-button Register__submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Get Started"}
                </button>

                <p className="Register__switch">
                    Already saving recipes? <Link to="/login">Login</Link>
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

    return "Registration failed. Please try again.";
}
