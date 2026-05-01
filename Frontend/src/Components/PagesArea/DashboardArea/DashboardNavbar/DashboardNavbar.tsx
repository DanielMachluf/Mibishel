import { useEffect, useState } from "react";
import { ArrowRight, Crown, Folder, Heart, Home, Info, Leaf, LogOut, UserRound, UtensilsCrossed } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.svg";
import { authStore, useAuthStore } from "../../../../store/authStore";
import "./DashboardNavbar.css";

const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home },
    { to: "/favorites", label: "Favorites", icon: Heart },
    { to: "/collections", label: "Collections", icon: Folder },
    { to: "/profile", label: "Profile", icon: UserRound },
    { to: "/about", label: "What is Dishshare?", icon: Info }
];

const decorativeIcons = [
    { icon: Leaf, className: "DashboardNavbar__decorIcon--leaf" },
    { icon: UtensilsCrossed, className: "DashboardNavbar__decorIcon--utensils" }
];

export function DashboardNavbar() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        function closeDesktopMenu() {
            if (window.innerWidth > 1080) {
                setIsMenuOpen(false);
            }
        }

        window.addEventListener("resize", closeDesktopMenu);
        return () => window.removeEventListener("resize", closeDesktopMenu);
    }, []);

    function closeMenu(): void {
        setIsMenuOpen(false);
    }

    function logout(): void {
        authStore.logout();
        setIsMenuOpen(false);
        navigate("/landing");
    }

    return (
        <aside className={`DashboardNavbar${isMenuOpen ? " DashboardNavbar--open" : ""}`} aria-label="Dashboard navigation">
            <button
                className="DashboardNavbar__toggle"
                type="button"
                aria-expanded={isMenuOpen}
                aria-label="Toggle dashboard menu"
                onClick={() => setIsMenuOpen(current => !current)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                </svg>
            </button>

            <div className="DashboardNavbar__panel">
                <NavLink to="/dashboard" className="DashboardNavbar__brand" aria-label="Dishshare dashboard" onClick={closeMenu}>
                    <span className="DashboardNavbar__brandMark" aria-hidden="true">
                        <img src={logo} alt="" />
                    </span>
                    <strong>DishShare</strong>
                </NavLink>

                <nav className="DashboardNavbar__nav">
                    {navItems.map(item => {
                        const Icon = item.icon;
                        return (
                            <NavLink key={item.to} to={item.to} className="DashboardNavbar__link" onClick={closeMenu}>
                                <Icon size={25} strokeWidth={2.1} aria-hidden="true" />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                <section className="DashboardNavbar__premium" aria-label="Premium upgrade">
                    <Crown size={42} strokeWidth={1.9} aria-hidden="true" />
                    <h2>Upgrade to Premium</h2>
                    <p>Unlock advanced nutrition insights, smart recommendations and more.</p>
                    <button type="button">
                        Upgrade Now
                        <ArrowRight size={18} aria-hidden="true" />
                    </button>
                </section>

                <section className="DashboardNavbar__account" aria-label="Account">
                    <div className="DashboardNavbar__accountIdentity">
                        <span>{user?.firstName?.charAt(0).toUpperCase() ?? "U"}</span>
                        <div>
                            <small>Signed in as</small>
                            <strong>{user?.firstName ?? "User"}</strong>
                        </div>
                    </div>
                    <button className="DashboardNavbar__logout" type="button" onClick={logout}>
                        <LogOut size={16} strokeWidth={2} aria-hidden="true" />
                        Sign out
                    </button>
                </section>

                <div className="DashboardNavbar__decor" aria-hidden="true">
                    {decorativeIcons.map(item => {
                        const Icon = item.icon;
                        return <Icon key={item.className} className={`DashboardNavbar__decorIcon ${item.className}`} strokeWidth={1.7} />;
                    })}
                </div>
            </div>

            <button
                className="DashboardNavbar__backdrop"
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
            >
                <span />
            </button>
        </aside>
    );
}
