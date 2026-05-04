import { FormEvent, useState } from "react";
import Lottie from "lottie-react";
import { Leaf, LockKeyhole, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../../Services/AuthService";
import { authStore } from "../../../../store/authStore";
import { notify } from "../../../../Utils/Notify";
import logo from "../../../../assets/PNG/Joyi-logo.png";
import loginWomenSvg from "../../../../assets/Svg/login-women.svg";
import foodVloggerData from "../../../../assets/animations/food-vlogger.json";
import "../Auth.css";
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
            notify.success("Welcome back to Joyi.");
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
        <div className="Login AuthPage AuthPage--login">
            <section className="AuthPage__story" aria-label="Login introduction">
                <span className="AuthPage__pill">Welcome back</span>
                <h1>Sign in to your recipe collection</h1>
                <p className="AuthPage__storyText">
                    Access your saved recipes, collections, and personalized recommendations.
                </p>
                <p className="AuthPage__slogan">Your social Cookbook</p>
                <div className="AuthPage__animation" aria-hidden="true">
                    <Lottie animationData={foodVloggerData} loop />
                </div>
            </section>

            <form className="Login__card AuthCard" onSubmit={submit}>
                <div className="AuthCard__brand">
                    <Link to="/" className="brand-logo Login__logo">
                        <span className="brand-logo__mark" aria-hidden="true">
                            <img src={logo} alt="" />
                        </span>
                        <span className="brand-logo__word">Joyi</span>
                    </Link>
                </div>
                <p className="AuthCard__slogan">Your social Cookbook</p>
                <div className="AuthCard__divider" aria-hidden="true">
                    <Leaf />
                </div>
                <h2 className="AuthCard__heading">Welcome back</h2>
                <p className="AuthCard__intro">Sign in to keep cooking from every recipe you have saved.</p>

                {error && <p className="form-error">{error}</p>}

                <label className="Login__field AuthField">
                    <span>Email</span>
                    <span className="AuthField__control">
                        <input
                            type="email"
                            value={email}
                            placeholder="you@example.com"
                            autoComplete="email"
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                        <Mail aria-hidden="true" />
                    </span>
                </label>

                <label className="Login__field AuthField">
                    <span>Password</span>
                    <span className="AuthField__control">
                        <input
                            type="password"
                            value={password}
                            placeholder="Your password"
                            autoComplete="current-password"
                            onChange={event => setPassword(event.target.value)}
                            required
                        />
                        <LockKeyhole aria-hidden="true" />
                    </span>
                </label>

                <button className="primary-button Login__submit AuthSubmit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Login"}
                </button>

                <p className="Login__switch AuthSwitch">
                    New to Joyi? <Link to="/register">Create an account</Link>
                </p>
            </form>

            <div className="AuthPage__visual Login__visual" aria-hidden="true">
                <img src={loginWomenSvg} alt="" />
            </div>
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
