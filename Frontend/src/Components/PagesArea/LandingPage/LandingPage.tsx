import { Link } from "react-router-dom";
import {
    ArrowRight,
    Bookmark,
    Camera,
    Folder,
    Heart,
    Leaf,
    Link2,
    Music2,
    Sparkles,
    Star,
    ThumbsUp,
    UtensilsCrossed
} from "lucide-react";
import logo from "../../../assets/PNG/Joyi-logo.png";
import chatBotIllustration from "../../../assets/Svg/Chat bot-amico.svg";
import healthyFoodIllustration from "../../../assets/Svg/Eating healthy food-cuate.svg";
import recipeBookIllustration from "../../../assets/Svg/login-recipe-book.svg";
import "./LandingPage.css";

const landingKitchenScene =
    "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1400&q=80";

const features = [
    {
        icon: UtensilsCrossed,
        title: "Smart Cookbook",
        text: "All your recipes in one beautiful, organized cookbook."
    },
    {
        icon: Heart,
        title: "Collections",
        text: "Create collections for every occasion and craving."
    },
    {
        icon: Sparkles,
        title: "Nutrition Info",
        text: "Get calories, macros and nutrition facts automatically."
    },
    {
        icon: Camera,
        title: "Access Anywhere",
        text: "Your recipes sync across all your devices."
    }
];

const steps = [
    {
        icon: Link2,
        title: "Paste the link",
        text: "Copy a recipe link from TikTok, Instagram, Facebook, or any platform."
    },
    {
        icon: Sparkles,
        title: "AI analyzes",
        text: "Our AI reads the video and extracts ingredients, steps, nutrition and more."
    },
    {
        icon: Folder,
        title: "Review & edit",
        text: "Check everything, make edits, adjust servings to fit your needs."
    },
    {
        icon: Bookmark,
        title: "Save & enjoy",
        text: "Save to your collections and enjoy your recipes anytime."
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
                        <Link className="primary-button LandingPage__primaryCta" to="/register">Get Started</Link>
                        <Link className="secondary-button LandingPage__secondaryCta" to="/login">Login</Link>
                    </div>

                    <div className="LandingPage__proof" aria-label="Social proof">
                        <div className="LandingPage__avatars" aria-hidden="true">
                            <span>J</span>
                            <span>M</span>
                            <span>A</span>
                            <span>D</span>
                        </div>
                        <div>
                            <div className="LandingPage__stars" aria-label="Rated 4.9 out of 5">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star key={index} fill="currentColor" />
                                ))}
                                <strong>4.9</strong>
                            </div>
                            <p>Join 10,000+ home cooks</p>
                        </div>
                    </div>
                </div>

                <div className="LandingPage__photoPanel" aria-hidden="true">
                    <img src={landingKitchenScene} alt="" />
                    <div className="LandingPage__floatingNote LandingPage__floatingNote--top">
                        <Bookmark />
                        <div>
                            <strong>Save from any platform</strong>
                            <span>TikTok, Instagram, Facebook and more.</span>
                        </div>
                    </div>
                    <div className="LandingPage__floatingNote LandingPage__floatingNote--middle">
                        <Sparkles />
                        <div>
                            <strong>AI does the magic</strong>
                            <span>We extract ingredients, steps, and nutrition.</span>
                        </div>
                    </div>
                    <div className="LandingPage__floatingNote LandingPage__floatingNote--bottom">
                        <Heart />
                        <div>
                            <strong>Your recipes, your way</strong>
                            <span>Organized, beautiful, and always accessible.</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="LandingPage__steps" aria-labelledby="landing-steps-heading">
                <p className="LandingPage__sectionKicker">How it works</p>
                <h2 id="landing-steps-heading">Save a recipe in seconds</h2>
                <div className="LandingPage__sectionFlourish" aria-hidden="true">
                    <Leaf />
                </div>
                <div className="LandingPage__stepGrid">
                    {steps.map((step, index) => {
                        const Icon = step.icon;

                        return (
                            <article className="LandingPage__step" key={step.title}>
                                <span className="LandingPage__stepNumber">{index + 1}</span>
                                <div className="LandingPage__stepIcon">
                                    <Icon />
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </article>
                        );
                    })}
                </div>
            </section>

            <section className="LandingPage__features" aria-labelledby="landing-features-heading">
                <h2 id="landing-features-heading">Everything you need in one place</h2>
                <div className="LandingPage__sectionFlourish" aria-hidden="true">
                    <Leaf />
                </div>
                <div className="LandingPage__featureGrid">
                    {features.map(feature => {
                        const Icon = feature.icon;

                        return (
                            <article className="LandingPage__featureCard" key={feature.title}>
                                <span>
                                    <Icon />
                                </span>
                                <h3>{feature.title}</h3>
                                <p>{feature.text}</p>
                            </article>
                        );
                    })}
                </div>

                <div className="LandingPage__illustrationRail" aria-hidden="true">
                    <img src={recipeBookIllustration} alt="" />
                    <img src={chatBotIllustration} alt="" />
                    <img src={healthyFoodIllustration} alt="" />
                </div>
            </section>

            <section className="LandingPage__cta">
                <div className="LandingPage__ctaImage" aria-hidden="true">
                    <img src={healthyFoodIllustration} alt="" />
                </div>
                <div className="LandingPage__ctaContent">
                    <p className="LandingPage__sectionKicker">Ready to start?</p>
                    <h2>Start building your perfect cookbook</h2>
                    <p>Join thousands of home cooks who save time and never lose a recipe again.</p>
                    <Link className="primary-button LandingPage__primaryCta" to="/register">
                        Get Started for Free
                        <ArrowRight />
                    </Link>
                    <span className="LandingPage__finePrint">Free to start. No credit card required.</span>
                </div>
            </section>

            <footer className="LandingPage__footer">
                <Link to="/" className="brand-logo LandingPage__footerLogo">
                    <span className="brand-logo__mark" aria-hidden="true">
                        <img src={logo} alt="" />
                    </span>
                    <span className="brand-logo__word">Joyi</span>
                </Link>
                <nav aria-label="Footer navigation">
                    <Link to="/">Home</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Get Started</Link>
                </nav>
                <div className="LandingPage__social" aria-label="Social platforms">
                    <span aria-label="Instagram">
                        <Camera />
                    </span>
                    <span aria-label="TikTok">
                        <Music2 />
                    </span>
                    <span aria-label="Community">
                        <ThumbsUp />
                    </span>
                </div>
            </footer>
        </div>
    );
}
