import { useEffect, useRef, useState } from "react";
import { Bookmark, ChefHat, Code2, ExternalLink, Flame, Leaf, Link2, MessageCircle, Sparkles, UtensilsCrossed, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";
import "./WhatIsDishshare.css";

const steps = [
    {
        icon: Link2,
        number: "01",
        title: "Paste a link",
        body: "Copy any TikTok, Instagram, or Facebook recipe video URL and paste it into the Dishshare input.",
    },
    {
        icon: Zap,
        number: "02",
        title: "Let automation do the work",
        body: "An n8n workflow scrapes the caption, extracts ingredients, instructions, nutrition, and thumbnail — no manual entry needed.",
    },
    {
        icon: Bookmark,
        number: "03",
        title: "It lands in your cookbook",
        body: "The structured recipe is saved to your personal dashboard, searchable and filterable by platform.",
    },
    {
        icon: MessageCircle,
        number: "04",
        title: "Ask Joy anything",
        body: "Open any saved recipe and ask the built-in AI assistant — substitutions, meal prep, macros, scaling — Joy has the context.",
    },
];

const features = [
    { icon: UtensilsCrossed, label: "TikTok, Instagram & Facebook", sub: "All three platforms supported" },
    { icon: Flame, label: "Full nutrition data", sub: "Calories, protein, carbs, fats" },
    { icon: ChefHat, label: "Structured recipes", sub: "Ingredients + step-by-step instructions" },
    { icon: Sparkles, label: "Joy AI assistant", sub: "Ask questions about any saved recipe" },
    { icon: Leaf, label: "Per-serving breakdown", sub: "Toggle between total and per serving" },
    { icon: Bookmark, label: "Private cookbook", sub: "Every recipe scoped to your account" },
];

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
}

function AnimatedSection({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
    const { ref, visible } = useInView();
    return (
        <div ref={ref} className={`WID__animated ${visible ? "WID__animated--in" : ""} ${className}`} style={style}>
            {children}
        </div>
    );
}

export function WhatIsDishshare() {
    return (
        <div className="WID">
            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="WID__hero">
                <div className="WID__heroDecor" aria-hidden="true">
                    <Leaf className="WID__heroLeaf" strokeWidth={1.4} />
                    <UtensilsCrossed className="WID__heroUtensils" strokeWidth={1.4} />
                </div>
                <AnimatedSection className="WID__heroContent">
                    <span className="WID__eyebrow">About Dishshare</span>
                    <h1 className="WID__heroTitle">
                        Your social feed<br />
                        is a <em>cookbook</em>.
                    </h1>
                    <p className="WID__heroSub">
                        Dishshare turns messy recipe captions from TikTok, Instagram, and Facebook
                        into a clean, searchable personal cookbook — then lets you ask an AI assistant
                        anything about each dish.
                    </p>
                    <NavLink to="/dashboard" className="WID__heroCta">
                        Open my cookbook
                    </NavLink>
                </AnimatedSection>
            </section>

            {/* ── How it works ─────────────────────────────────── */}
            <section className="WID__section">
                <AnimatedSection>
                    <h2 className="WID__sectionTitle">How it works</h2>
                    <p className="WID__sectionSub">Four steps from a link to a structured recipe.</p>
                </AnimatedSection>

                <div className="WID__steps">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <AnimatedSection key={step.number} className="WID__step" style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}>
                                <div className="WID__stepHead">
                                    <span className="WID__stepNumber">{step.number}</span>
                                    <span className="WID__stepIconWrap">
                                        <Icon size={22} strokeWidth={1.9} />
                                    </span>
                                </div>
                                <h3 className="WID__stepTitle">{step.title}</h3>
                                <p className="WID__stepBody">{step.body}</p>
                            </AnimatedSection>
                        );
                    })}
                </div>
            </section>

            {/* ── Features grid ────────────────────────────────── */}
            <section className="WID__section WID__section--alt">
                <AnimatedSection>
                    <h2 className="WID__sectionTitle">What's inside</h2>
                    <p className="WID__sectionSub">Everything extracted automatically, nothing typed manually.</p>
                </AnimatedSection>

                <div className="WID__features">
                    {features.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <AnimatedSection key={feat.label} className="WID__feat" style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}>
                                <span className="WID__featIcon"><Icon size={20} strokeWidth={1.9} /></span>
                                <strong className="WID__featLabel">{feat.label}</strong>
                                <span className="WID__featSub">{feat.sub}</span>
                            </AnimatedSection>
                        );
                    })}
                </div>
            </section>

            {/* ── Tech stack callout ───────────────────────────── */}
            <section className="WID__section">
                <AnimatedSection className="WID__tech">
                    <h2 className="WID__sectionTitle">Under the hood</h2>
                    <div className="WID__techPills">
                        {["React 19", "TypeScript", "Vite", "Express 5", "MySQL", "n8n", "JWT", "Lucide Icons", "Joi", "Axios"].map(t => (
                            <span key={t} className="WID__techPill">{t}</span>
                        ))}
                    </div>
                </AnimatedSection>
            </section>

            {/* ── Creator card ─────────────────────────────────── */}
            <section className="WID__section WID__section--alt">
                <AnimatedSection className="WID__creator">
                    <div className="WID__creatorAvatar" aria-hidden="true">DM</div>
                    <div className="WID__creatorBody">
                        <h2 className="WID__creatorName">Daniel Mac</h2>
                        <p className="WID__creatorRole">Full-Stack AI Developer · 21 · Tel Aviv</p>
                        <p className="WID__creatorBio">
                            Student at <strong>John Bryce Academy</strong>, building full-stack applications
                            with a focus on AI integration, automation, and clean product design.
                            Dishshare is a personal project that combines all three.
                        </p>
                        <a
                            className="WID__creatorGithub"
                            href="https://github.com/DanielMachluf"
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <Code2 size={17} strokeWidth={2} aria-hidden="true" />
                            github.com/DanielMachluf
                            <ExternalLink size={13} strokeWidth={2} aria-hidden="true" />
                        </a>
                    </div>
                </AnimatedSection>
            </section>
        </div>
    );
}
