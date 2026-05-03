import { FormEvent, useState } from "react";
import Lottie from "lottie-react";
import { Leaf, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../../../Services/AuthService";
import { authStore } from "../../../../store/authStore";
import { notify } from "../../../../Utils/Notify";
import logo from "../../../../assets/logo.svg";
import loginRecipeBookSvg from "../../../../assets/Svg/login-recipe-book.svg";
import selectFoodData from "../../../../assets/animations/select-food.json";
import "../Auth.css";
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
        <div className="Register AuthPage AuthPage--register">
            <section className="AuthPage__story" aria-label="Register introduction">
                <span className="AuthPage__pill">Start cooking</span>
                <h1>Create your recipe collection</h1>
                <p className="AuthPage__storyText">
                    Turn social food finds into a calm, searchable cookbook made for your kitchen.
                </p>
                <p className="AuthPage__slogan">Your social Cookbook</p>
                <div className="AuthPage__animation" aria-hidden="true">
                    <Lottie animationData={selectFoodData} loop />
                </div>
               
            </section>

            <form className="Register__card AuthCard" onSubmit={submit}>
                <div className="AuthCard__brand">
                    <Link to="/" className="brand-logo Register__logo">
                        <span className="brand-logo__mark" aria-hidden="true">
                            <img src={logo} alt="" />
                        </span>
                        <span className="brand-logo__word">Dishshare</span>
                    </Link>
                </div>
                <p className="AuthCard__slogan">Your social Cookbook</p>
                <div className="AuthCard__divider" aria-hidden="true">
                    <Leaf />
                </div>
                <h2 className="AuthCard__heading">Create your cookbook</h2>
                <p className="AuthCard__intro">Save every recipe worth revisiting in one cozy collection.</p>

                {error && <p className="form-error">{error}</p>}

                <div className="Register__nameGrid AuthNameGrid">
                    <label className="Register__field AuthField">
                        <span>First name</span>
                        <span className="AuthField__control">
                            <input
                                value={firstName}
                                placeholder="Maya"
                                autoComplete="given-name"
                                onChange={event => setFirstName(event.target.value)}
                                required
                            />
                            <UserRound aria-hidden="true" />
                        </span>
                    </label>

                    <label className="Register__field AuthField">
                        <span>Last name</span>
                        <span className="AuthField__control">
                            <input
                                value={lastName}
                                placeholder="Cohen"
                                autoComplete="family-name"
                                onChange={event => setLastName(event.target.value)}
                                required
                            />
                            <UserRound aria-hidden="true" />
                        </span>
                    </label>
                </div>

                <label className="Register__field AuthField">
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

                <label className="Register__field AuthField">
                    <span>Password</span>
                    <span className="AuthField__control">
                        <input
                            type="password"
                            value={password}
                            placeholder="Choose a password"
                            autoComplete="new-password"
                            onChange={event => setPassword(event.target.value)}
                            required
                        />
                        <LockKeyhole aria-hidden="true" />
                    </span>
                </label>

                <button className="primary-button Register__submit AuthSubmit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Get Started"}
                </button>

                <p className="Register__switch AuthSwitch">
                    Already saving recipes? <Link to="/login">Login</Link>
                </p>
            </form>

            <div className="AuthPage__visual Register__visual" aria-hidden="true">
                <img src={loginRecipeBookSvg} alt="" />
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

    return "Registration failed. Please try again.";
}
