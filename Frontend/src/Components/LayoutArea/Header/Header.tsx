import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../../store/authStore";
import logo from "../../../assets/logo.svg";
import "./Header.css";

export function Header() {
    const { token } = useAuthStore();

    if (token) return null;

    return (
        <header className="Header">
            <NavLink to="/" className="brand-logo Header__logo">
                <span className="brand-logo__mark" aria-hidden="true">
                    <img src={logo} alt="" />
                </span>
                <span className="brand-logo__word">Joyi</span>
            </NavLink>

            <nav className="Header__nav" aria-label="Main navigation">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink className="Header__register" to="/register">Get Started</NavLink>
            </nav>

            <div className="Header__profile Header__profile--empty" aria-hidden="true" />
        </header>
    );
}
