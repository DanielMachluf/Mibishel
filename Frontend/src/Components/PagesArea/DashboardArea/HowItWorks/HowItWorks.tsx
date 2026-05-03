import { Bot, CheckCircle2, Clipboard, Link2, Play, Sparkles } from "lucide-react";
import "./HowItWorks.css";

const steps = [
    {
        icon: Link2,
        title: "Copy link",
        text: "Copy a recipe link from TikTok, Instagram, Facebook or any platform."
    },
    {
        icon: Clipboard,
        title: "Paste",
        text: "Paste the link above and click analyze."
    },
    {
        icon: Sparkles,
        title: "AI analyzes",
        text: "AI reads the ingredients, steps and all the useful details."
    },
    {
        icon: CheckCircle2,
        title: "Recipe saved",
        text: "You get a clean, organized recipe saved in your collection."
    }
];

export function HowItWorks() {
    return (
        <section className="HowItWorks" aria-labelledby="how-it-works-title">
            <div className="HowItWorks__intro">
                <div>
                    <h2 id="how-it-works-title">How Dishshare works</h2>
                    <p>Paste a recipe link below and let AI turn it into a clean, organized recipe.</p>
                </div>
                <span className="HowItWorks__leaf" aria-hidden="true" />
            </div>

            <div className="HowItWorks__content">
                <div className="HowItWorks__steps" aria-label="Four simple steps">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const stepNumber = String(index + 1).padStart(2, "0");

                        return (
                            <article className="HowItWorks__step" key={step.title}>
                                <div className="HowItWorks__stepRail" aria-hidden="true">
                                    <span className="HowItWorks__stepNumber">{stepNumber}</span>
                                    <span className="HowItWorks__stepDot">
                                        <span className="HowItWorks__stepIcon">
                                            <Icon size={22} />
                                        </span>
                                    </span>
                                </div>
                                <div className="HowItWorks__stepContent">
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="HowItWorks__demo" aria-hidden="true">
                    <div className="HowItWorks__videoCard">
                        <div className="HowItWorks__videoImage">
                            <span className="HowItWorks__playButton">
                                <Play fill="currentColor" size={28} />
                            </span>
                        </div>
                        <div className="HowItWorks__videoMeta">
                            <span>@cookwithme</span>
                            <strong>Creamy Garlic Pasta</strong>
                        </div>
                    </div>

                    <div className="HowItWorks__copyBubble">
                        <Link2 size={16} />
                        <span>https://...</span>
                        <strong>Copied!</strong>
                    </div>

                    <div className="HowItWorks__analyzeCard">
                        <span>Paste your link here</span>
                        <button type="button">
                            <Sparkles size={14} />
                            Analyze Recipe
                        </button>
                    </div>

                    <div className="HowItWorks__bot">
                        <Bot size={30} />
                        <span>AI is analyzing...</span>
                    </div>

                    <div className="HowItWorks__recipeCard">
                        <div className="HowItWorks__recipePhoto" />
                        <h3>Creamy Garlic Pasta</h3>
                        <div className="HowItWorks__recipeStats">
                            <span>25 min</span>
                            <span>2 servings</span>
                            <span>520 cal</span>
                        </div>
                        <div className="HowItWorks__recipeLines">
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        <strong>Saved to my recipes!</strong>
                    </div>
                </div>
            </div>
        </section>
    );
}
