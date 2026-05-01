import "./RecipeCookingCard.css";

export function RecipeCookingCard() {
    return (
        <article className="RecipeCookingCard" aria-live="polite">
            <div className="RecipeCookingCard__thumbnail" />
            <div className="RecipeCookingCard__body">
                <p>🔍 Cooking your recipe...</p>
                <div className="RecipeCookingCard__progress">
                    <span />
                </div>
            </div>
        </article>
    );
}
