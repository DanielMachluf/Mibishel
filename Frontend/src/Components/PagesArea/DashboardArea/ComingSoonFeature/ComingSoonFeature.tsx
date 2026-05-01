import type { LucideIcon } from "lucide-react";
import "./ComingSoonFeature.css";

interface ComingSoonFeatureProps {
    title: string;
    description: string;
    icon: LucideIcon;
}

export function ComingSoonFeature({ title, description, icon: Icon }: ComingSoonFeatureProps) {
    return (
        <main className="ComingSoonFeature">
            <section className="ComingSoonFeature__card">
                <span className="ComingSoonFeature__icon" aria-hidden="true">
                    <Icon size={74} strokeWidth={1.6} />
                </span>
                <p className="ComingSoonFeature__eyebrow">Coming soon</p>
                <h1>{title}</h1>
                <p>{description}</p>
            </section>
        </main>
    );
}
