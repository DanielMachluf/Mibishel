import { MouseEvent, useState } from "react";
import { Camera, Droplets, Flame, Music2, Pencil, ThumbsUp, Users, Wheat, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RecipeModel } from "../../../Models/recipe-model";
import "./RecipeCard.css";

interface RecipeCardProps {
    recipe: RecipeModel;
    onDelete: (recipeId: number) => void;
    accentIndex?: number;
}

const fallbackImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85";

export function RecipeCard({ recipe, onDelete, accentIndex = 0 }: RecipeCardProps) {
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const ingredientPreview = recipe.ingredients.slice(0, 4);
    const accentClass = `RecipeCard--accent${(accentIndex % 4) + 1}`;

    function openRecipe(): void {
        if (confirmDelete) return;
        navigate(`/recipe/${recipe.recipeId}`);
    }

    function askConfirm(event: MouseEvent<HTMLButtonElement>): void {
        event.stopPropagation();
        setConfirmDelete(true);
    }

    function cancelDelete(event: MouseEvent<HTMLButtonElement>): void {
        event.stopPropagation();
        setConfirmDelete(false);
    }

    function navigateToEdit(event: MouseEvent<HTMLButtonElement>): void {
        event.stopPropagation();
        navigate(`/recipe/${recipe.recipeId}/edit`);
    }

    function confirmAndDelete(event: MouseEvent<HTMLButtonElement>): void {
        event.stopPropagation();
        onDelete(recipe.recipeId);
    }

    return (
        <article className={`RecipeCard RecipeCard--${recipe.platform} ${accentClass}`} onClick={openRecipe}>
            <header className="RecipeCard__topLine">
                <span className={`RecipeCard__platform RecipeCard__platform--${recipe.platform}`}>
                    <span aria-hidden="true">{getPlatformIcon(recipe.platform)}</span>
                    {getPlatformLabel(recipe.platform)}
                </span>

                {confirmDelete ? (
                    <div className="RecipeCard__confirm" onClick={e => e.stopPropagation()}>
                        <span>Delete?</span>
                        <button className="RecipeCard__confirmYes" onClick={confirmAndDelete} aria-label="Confirm delete">Yes</button>
                        <button className="RecipeCard__confirmNo" onClick={cancelDelete} aria-label="Cancel delete">No</button>
                    </div>
                ) : (
                    <div className="RecipeCard__actions">
                        <button
                            className="RecipeCard__edit"
                            onClick={navigateToEdit}
                            aria-label={`Edit ${recipe.title}`}
                            title="Edit recipe"
                        >
                            <Pencil size={13} />
                        </button>
                        <button
                            className="RecipeCard__delete"
                            onClick={askConfirm}
                            aria-label={`Delete ${recipe.title}`}
                            title="Delete recipe"
                        >
                            ✕
                        </button>
                    </div>
                )}
            </header>

            <div className="RecipeCard__body">
                <h2>{recipe.title}</h2>

                <div className="RecipeCard__facts" aria-label="Recipe nutrition facts">
                    <div className="RecipeCard__fact RecipeCard__fact--calories">
                        <span aria-hidden="true"><Flame size={12} /></span>
                        <em>Calories</em>
                        <strong>{recipe.caloriesPerServing || 0} kcal</strong>
                    </div>
                    <div className="RecipeCard__fact RecipeCard__fact--protein">
                        <span aria-hidden="true"><Dumbbell size={12} /></span>
                        <em>Protein</em>
                        <strong>{recipe.proteinPerServing || 0} g</strong>
                    </div>
                    <div className="RecipeCard__fact RecipeCard__fact--carbs">
                        <span aria-hidden="true"><Wheat size={12} /></span>
                        <em>Carbs</em>
                        <strong>{recipe.carbsPerServing || 0} g</strong>
                    </div>
                    <div className="RecipeCard__fact RecipeCard__fact--fats">
                        <span aria-hidden="true"><Droplets size={12} /></span>
                        <em>Fats</em>
                        <strong>{recipe.fatsPerServing || 0} g</strong>
                    </div>
                    <div className="RecipeCard__fact RecipeCard__fact--servings">
                        <span aria-hidden="true"><Users size={12} /></span>
                        <em>Servings</em>
                        <strong>{recipe.servings || "Not set"}</strong>
                    </div>
                </div>

                <div className="RecipeCard__imageWrap">
                    <img
                        src={recipe.thumbnail || fallbackImage}
                        alt={recipe.title}
                        className="RecipeCard__image"
                    />
                </div>

                <section className="RecipeCard__ingredientsBlock" aria-label="Ingredient preview">
                    <h3>Ingredients</h3>
                    <ul className="RecipeCard__ingredients">
                        {ingredientPreview.length > 0 ? (
                            ingredientPreview.map(ingredient => (
                                <li key={ingredient}>{ingredient}</li>
                            ))
                        ) : (
                            <li>Ingredients are being polished.</li>
                        )}
                    </ul>
                </section>
            </div>
        </article>
    );
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
