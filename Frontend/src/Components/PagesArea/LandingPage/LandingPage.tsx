import { Link } from "react-router-dom";
import "./LandingPage.css";

const features = [
    {
        icon: "A",
        title: "Any Platform",
        text: "Paste recipe links from TikTok, Instagram, or Facebook and keep every craving in one kitchen."
    },
    {
        icon: "AI",
        title: "AI Extracted",
        text: "Dishshare turns messy captions into ingredients, steps, servings, and calories."
    },
    {
        icon: "C",
        title: "Your Collection",
        text: "Build a warm, searchable recipe shelf that keeps dinner ideas close."
    }
];

export function LandingPage() {
    return (
        <div className="LandingPage">
            <section className="LandingPage__hero">
                <div className="LandingPage__heroContent">
                    <h1>
                        <span>Save Every</span>
                        <span>Recipe You</span>
                        <span>Love</span>
                    </h1>
                    <p>
                        Turn social food videos into a personal cookbook with ingredients,
                        instructions, servings, and nutrition ready when you are.
                    </p>
                    <div className="LandingPage__actions">
                        <Link className="primary-button" to="/register">Get Started</Link>
                        <Link className="secondary-button" to="/login">Login</Link>
                    </div>
                </div>

                <div className="LandingPage__photoPanel" aria-hidden="true">
                    <img
                        src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=900&q=85"
                        alt=""
                    />
                    <div className="LandingPage__recipeNote">
                        <strong>Saved today</strong>
                        <span>Roasted tomato rigatoni</span>
                    </div>
                </div>
            </section>

            <section className="LandingPage__features" aria-label="Features">
                {features.map(feature => (
                    <article className="LandingPage__featureCard" key={feature.title}>
                        <span>{feature.icon}</span>
                        <h2>{feature.title}</h2>
                        <p>{feature.text}</p>
                    </article>
                ))}
            </section>

            <section className="LandingPage__cta">
                <h2>Your best recipe ideas deserve a real home.</h2>
                <Link className="primary-button" to="/register">Create your cookbook</Link>
            </section>
        </div>
    );
}
