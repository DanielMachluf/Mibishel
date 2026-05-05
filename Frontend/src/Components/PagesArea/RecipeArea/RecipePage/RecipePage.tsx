import { useEffect, useMemo, useState } from "react";
import { Camera, ChefHat, Droplets, Flame, Leaf, Music2, Sparkles, ThumbsUp, Users, UtensilsCrossed, Wheat, Dumbbell } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import type { RecipeModel } from "../../../../Models/recipe-model";
import { recipeService } from "../../../../Services/RecipeService";
import { appConfig } from "../../../../Utils/AppConfig";
import { notify } from "../../../../Utils/Notify";
import { RecipeJoyAssistant } from "../RecipeJoyAssistant/RecipeJoyAssistant";
import "./RecipePage.css";

const fallbackImage = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85";

type NutritionTab = "total" | "serving";

type RecipeWithNutrition = RecipeModel & {
    protein: number;
    carbs: number;
    fats: number;
    proteinPerServing: number;
    carbsPerServing: number;
    fatsPerServing: number;
};

export function RecipePage() {
    const navigate = useNavigate();
    const params = useParams();
    const [recipe, setRecipe] = useState<RecipeModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<NutritionTab>("serving");

    const steps = useMemo(() => {
        if (!recipe?.instructions) return [];
        return recipe.instructions
            .split("\n")
            .map(step => step.trim())
            .filter(Boolean);
    }, [recipe?.instructions]);

    useEffect(() => {
        loadRecipe();
    }, [params.id]);

    async function loadRecipe(): Promise<void> {
        const recipeId = Number(params.id);
        if (!Number.isInteger(recipeId) || recipeId <= 0) {
            setError("Invalid recipe id.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const recipeFromApi = await recipeService.getRecipeById(recipeId);
            setRecipe(recipeFromApi);
        }
        catch (err: unknown) {
            setError("Could not load this recipe.");
            notify.error(err);
        }
        finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="RecipePage RecipePage--state">
                <span className="spinner" />
                <strong>Loading recipe...</strong>
            </div>
        );
    }

    if (error || !recipe) {
        return (
            <div className="RecipePage RecipePage--state">
                <h1>{error || "Recipe not found."}</h1>
                <button className="secondary-button" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        );
    }

    const recipeDetails = recipe as RecipeWithNutrition;
    const heroImage = getThumbnailUrl(recipeDetails.thumbnail);
    const summaryIngredients = recipeDetails.ingredients.slice(0, 3).join(", ");
    const recipeSummary = summaryIngredients
        ? `מתכון שמור מהרשת שמבוסס על ${summaryIngredients}. למטה תמצאו את המרכיבים ואת שלבי ההכנה בגרסה מסודרת ונוחה למטבח הביתי.`
        : "מתכון שמור עם מרכיבים, ערכים תזונתיים ושלבי הכנה ברורים ונוחים למטבח הביתי.";
    const nutritionItems = activeTab === "total" ? [
        { key: "calories", label: "Calories", value: recipeDetails.totalCalories, unit: "" },
        { key: "protein", label: "Protein", value: recipeDetails.protein, unit: "g" },
        { key: "carbs", label: "Carbs", value: recipeDetails.carbs, unit: "g" },
        { key: "fats", label: "Fats", value: recipeDetails.fats, unit: "g" }
    ] : [
        { key: "calories", label: "Calories", value: recipeDetails.caloriesPerServing, unit: "" },
        { key: "protein", label: "Protein", value: recipeDetails.proteinPerServing, unit: "g" },
        { key: "carbs", label: "Carbs", value: recipeDetails.carbsPerServing, unit: "g" },
        { key: "fats", label: "Fats", value: recipeDetails.fatsPerServing, unit: "g" }
    ];
    const maxNutritionValue = Math.max(...nutritionItems.map(item => item.value), 1);

    return (
        <article className="RecipePage">
            <div className="RecipePage__shell">
                <div className="RecipePage__topBar">
                    <button className="RecipePage__back" onClick={() => navigate(-1)}>
                        <span aria-hidden="true">←</span>
                        Back to recipes
                    </button>
                    <button
                        className="RecipePage__editBtn"
                        onClick={() => navigate(`/recipe/${recipeDetails.recipeId}/edit`)}
                        type="button"
                    >
                        <span aria-hidden="true">✎</span>
                        Edit Recipe
                    </button>
                </div>

                <section className="RecipePage__hero">
                    <figure className="RecipePage__photoFrame">
                        <img src={heroImage} alt={recipeDetails.title} />
                    </figure>

                    <header className="RecipePage__titleBlock">
                        <h1>{recipeDetails.title}</h1>

                        <div className="RecipePage__badges">
                            <span className={`RecipePage__badge RecipePage__badge--platform RecipePage__badge--platform-${getPlatformClass(recipeDetails.platform)}`}>
                                <span aria-hidden="true">{getPlatformIcon(recipeDetails.platform)}</span>
                                {getPlatformLabel(recipeDetails.platform)}
                            </span>
                            <span className="RecipePage__badge RecipePage__badge--servings">
                                <span aria-hidden="true"><Users size={14} /></span>
                                {recipeDetails.servings}
                            </span>
                            <span className="RecipePage__badge RecipePage__badge--calories">
                                <span aria-hidden="true"><Flame size={14} /></span>
                                {recipeDetails.caloriesPerServing} Calories
                            </span>
                        </div>

                        <p>{recipeSummary}</p>
                    </header>

                    <div className="RecipePage__decos" aria-hidden="true">
                        <Leaf className="RecipePage__deco RecipePage__deco--1" />
                        <Sparkles className="RecipePage__deco RecipePage__deco--2" />
                        <ChefHat className="RecipePage__deco RecipePage__deco--3" />
                        <UtensilsCrossed className="RecipePage__deco RecipePage__deco--4" />
                    </div>
                </section>

                <div className="RecipePage__content">
                    <section className="RecipePage__card RecipePage__nutritionCard" aria-label="Nutrition">
                        <div className={`RecipePage__toggle RecipePage__toggle--${activeTab}`} role="tablist" aria-label="Nutrition view">
                            <span className="RecipePage__toggleActive" />
                            <button
                                className={activeTab === "total" ? "RecipePage__toggleButton RecipePage__toggleButton--active" : "RecipePage__toggleButton"}
                                onClick={() => setActiveTab("total")}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === "total"}
                            >
                                Total Recipe
                            </button>
                            <button
                                className={activeTab === "serving" ? "RecipePage__toggleButton RecipePage__toggleButton--active" : "RecipePage__toggleButton"}
                                onClick={() => setActiveTab("serving")}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === "serving"}
                            >
                                Per Serving
                            </button>
                        </div>

                        <ul className="RecipePage__nutritionList" key={activeTab}>
                            {nutritionItems.map(item => (
                                <li className={`RecipePage__nutritionRow RecipePage__nutritionRow--${item.key}`} key={item.key}>
                                    <span className="RecipePage__nutritionIcon">
                                        {getNutritionIcon(item.key)}
                                    </span>

                                    <div className="RecipePage__nutritionInfo">
                                        <span>{item.label}</span>
                                        <div className="RecipePage__progressTrack">
                                            <progress className="RecipePage__progressFill" max={maxNutritionValue} value={item.value} />
                                        </div>
                                    </div>

                                    <strong className="RecipePage__valueChip">
                                        {item.value}{item.unit}
                                    </strong>
                                </li>
                            ))}
                        </ul>

                        <p className="RecipePage__nutritionNote">* Nutrition values are estimates</p>
                    </section>

                    <section className="RecipePage__card RecipePage__ingredientsCard">
                        <h2>Ingredients</h2>
                        <ul className="RecipePage__ingredients">
                            {recipeDetails.ingredients.map(ingredient => (
                                <li className="RecipePage__ingredientTag" key={ingredient}>
                                    {ingredient}
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="RecipePage__instructions">
                        <h2>Instructions</h2>
                        <ol className="RecipePage__steps">
                            {steps.map((step, index) => (
                                <li key={`${step}-${index}`}>
                                    <span>{index + 1}</span>
                                    <p>{step}</p>
                                </li>
                            ))}
                        </ol>
                    </section>

                    <section className="RecipePage__watchCard" aria-label="Watch original recipe video">
                        <button className="RecipePage__watchMedia" onClick={() => window.open(recipeDetails.linkUrl, "_blank")} type="button">
                            <img src={heroImage} alt="" aria-hidden="true" />
                            <span className="RecipePage__watchOverlay" />
                            <span className="RecipePage__playButton" aria-hidden="true">
                                <span />
                            </span>
                            <span className={`RecipePage__platformBadge RecipePage__platformBadge--${getPlatformClass(recipeDetails.platform)}`}>
                                <span aria-hidden="true">{getPlatformIcon(recipeDetails.platform)}</span>
                                {getPlatformLabel(recipeDetails.platform)}
                            </span>
                        </button>

                        <div className="RecipePage__watchCopy">
                            <h2>Watch Original Video</h2>
                            <p>Watch the original recipe video on {getPlatformLabel(recipeDetails.platform)}</p>
                            <button onClick={() => window.open(recipeDetails.linkUrl, "_blank")} type="button">
                                Watch on {getPlatformLabel(recipeDetails.platform)}
                                <span aria-hidden="true">→</span>
                            </button>
                        </div>

                    </section>
                </div>
            </div>

            <RecipeJoyAssistant recipe={recipeDetails} />
        </article>
    );
}

function getThumbnailUrl(thumbnail: string): string {
    if (!thumbnail) return fallbackImage;
    if (thumbnail.startsWith("http")) return thumbnail;
    return `${appConfig.serverUrl}/${thumbnail.replace(/^\/+/, "")}`;
}

function getPlatformLabel(platform: RecipeModel["platform"]): string {
    if (platform === "tiktok") return "TikTok";
    if (platform === "instagram") return "Instagram";
    return "Facebook";
}

function getPlatformIcon(platform: RecipeModel["platform"]) {
    if (platform === "tiktok") return <Music2 size={12} />;
    if (platform === "instagram") return <Camera size={12} />;
    return <ThumbsUp size={12} />;
}

function getNutritionIcon(key: string) {
    if (key === "calories") return <Flame size={18} />;
    if (key === "protein") return <Dumbbell size={18} />;
    if (key === "carbs") return <Wheat size={18} />;
    return <Droplets size={18} />;
}

function getPlatformClass(platform: RecipeModel["platform"]): string {
    if (platform === "tiktok") return "tiktok";
    if (platform === "instagram") return "instagram";
    return "facebook";
}
