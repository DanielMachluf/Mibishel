import { FormEvent, useEffect, useRef, useState } from "react";
import { Camera, ClipboardPaste, Leaf, Link2, Music2, Plus, Search, Sparkles, ThumbsUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RecipeCard } from "../../../CardsArea/RecipeCard/RecipeCard";
import { RecipeCookingCard } from "../../../CardsArea/RecipeCookingCard/RecipeCookingCard";
import { HowItWorks } from "../HowItWorks/HowItWorks";
import type { RecipeModel } from "../../../../Models/recipe-model";
import { recipeService } from "../../../../Services/RecipeService";
import { authStore, useAuthStore } from "../../../../store/authStore";
import { notify } from "../../../../Utils/Notify";
import "./Dashboard.css";

type PlatformFilter = "all" | "tiktok" | "instagram" | "facebook";

export function Dashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [recipes, setRecipes] = useState<RecipeModel[]>([]);
    const [linkUrl, setLinkUrl] = useState("");
    const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");

    const filteredRecipes = recipes.filter(recipe => {
        const matchesText = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPlatform = platformFilter === "all" || recipe.platform === platformFilter;
        return matchesText && matchesPlatform;
    });

    function clearFilters(): void {
        setSearchQuery("");
        setPlatformFilter("all");
    }

    useEffect(() => {
        loadRecipes();
    }, []);

    async function loadRecipes(): Promise<void> {
        setIsLoadingRecipes(true);
        setError("");

        try {
            const recipesFromApi = await recipeService.getAllRecipes();
            setRecipes(recipesFromApi);
        }
        catch (err: unknown) {
            setError("Could not load your recipes.");
            notify.error(err);
        }
        finally {
            setIsLoadingRecipes(false);
        }
    }

    async function pasteFromClipboard(): Promise<void> {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setLinkUrl(clipboardText);
        }
        catch {
            notify.error("Clipboard access is blocked by the browser.");
        }
    }

    async function saveRecipe(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (!authStore.isLoggedIn()) {
            notify.error("Session expired. Please log in again.");
            navigate("/login", { replace: true });
            return;
        }

        const trimmedUrl = linkUrl.trim();
        if (!trimmedUrl) {
            notify.error("Paste a recipe link first.");
            inputRef.current?.focus();
            return;
        }

        setIsSaving(true);
        setError("");

        try {
            const savedRecipe = await recipeService.scrapeAndSave(trimmedUrl);
            setRecipes(currentRecipes => [savedRecipe, ...currentRecipes]);
            setLinkUrl("");
            notify.success("Recipe saved to your collection.");
        }
        catch (err: unknown) {
            setError("Recipe extraction failed. Please check the link and try again.");
            notify.error(err);
        }
        finally {
            setIsSaving(false);
        }
    }

    async function deleteRecipe(recipeId: number): Promise<void> {
        try {
            await recipeService.deleteRecipe(recipeId);
            setRecipes(currentRecipes => currentRecipes.filter(recipe => recipe.recipeId !== recipeId));
            notify.success("Recipe deleted.");
        }
        catch (err: unknown) {
            notify.error(err);
        }
    }

    function focusFirstRecipeInput(): void {
        if (!authStore.isLoggedIn()) {
            notify.error("Session expired. Please log in again.");
            navigate("/login", { replace: true });
            return;
        }

        inputRef.current?.focus();
    }

    return (
        <div className="Dashboard">
            <div className="Dashboard__page">
                <section className="Dashboard__composer">
                    <div className="Dashboard__hero">
                        <p className="Dashboard__greeting">Hi {user?.firstName ?? "there"} 👋</p>
                        <h1>You have {recipes.length} recipes saved</h1>
                        <p className="Dashboard__subtitle">Paste a link and we&apos;ll do the rest.</p>

                        <div className="Dashboard__heroDecor" aria-hidden="true">
                            <Leaf className="Dashboard__heroDecorMain" />
                            <Sparkles className="Dashboard__heroDecorAccent" />
                        </div>
                    </div>

                    <form className="Dashboard__inputCard" onSubmit={saveRecipe}>
                        <label className="Dashboard__inputWrap">
                            <Link2 aria-hidden="true" />
                            <input
                                ref={inputRef}
                                type="url"
                                value={linkUrl}
                                placeholder="Paste TikTok, Instagram or Facebook link..."
                                onChange={event => setLinkUrl(event.target.value)}
                                disabled={isSaving}
                            />
                        </label>

                        <div className="Dashboard__platformHints" aria-label="Supported platforms">
                            <button type="button" onClick={pasteFromClipboard} disabled={isSaving} title="Paste from clipboard">
                                <ClipboardPaste size={16} aria-hidden="true" />
                            </button>
                            <span className="Dashboard__platformIcon Dashboard__platformIcon--tiktok"><Music2 size={18} aria-hidden="true" /></span>
                            <span className="Dashboard__platformIcon Dashboard__platformIcon--instagram"><Camera size={18} aria-hidden="true" /></span>
                            <span className="Dashboard__platformIcon Dashboard__platformIcon--facebook"><ThumbsUp size={17} aria-hidden="true" /></span>
                        </div>

                        <button className="Dashboard__saveButton" disabled={isSaving}>
                            <Plus size={16} aria-hidden="true" />
                            Analyze Recipe
                        </button>
                    </form>
                </section>

                {error && <p className="form-error Dashboard__error">{error}</p>}

                <HowItWorks />

                {!isLoadingRecipes && recipes.length > 0 && (
                    <section className="Dashboard__collectionArea">
                        <div className="Dashboard__collectionHeader">
                            <h2>Your Saved Recipes</h2>
                        </div>

                        <div className="Dashboard__search">
                            <label className="Dashboard__searchWrap">
                                <Search aria-hidden="true" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    placeholder="Search your recipes..."
                                    onChange={event => setSearchQuery(event.target.value)}
                                    aria-label="Search recipes by title"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        className="Dashboard__searchClear"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Clear search"
                                    >
                                        ×
                                    </button>
                                )}
                            </label>

                            <div className="Dashboard__chips" role="group" aria-label="Filter by platform">
                                {(["all", "tiktok", "instagram", "facebook"] as const).map(platform => (
                                    <button
                                        key={platform}
                                        type="button"
                                        className={`Dashboard__chip Dashboard__chip--${platform}${platformFilter === platform ? " Dashboard__chip--active" : ""}`}
                                        onClick={() => setPlatformFilter(platform)}
                                        aria-pressed={platformFilter === platform}
                                    >
                                        {platform === "all" && "All"}
                                        {platform === "tiktok" && <><Music2 size={14} aria-hidden="true" /> TikTok</>}
                                        {platform === "instagram" && <><Camera size={14} aria-hidden="true" /> Instagram</>}
                                        {platform === "facebook" && <><ThumbsUp size={14} aria-hidden="true" /> Facebook</>}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </section>
                )}

                {isLoadingRecipes ? (
                    <div className="Dashboard__loading Dashboard__loading--page">
                        <span className="spinner" />
                        <strong>Loading your saved recipes...</strong>
                    </div>
                ) : filteredRecipes.length > 0 || isSaving ? (
                    <section className="Dashboard__grid" aria-label="Saved recipes">
                        {isSaving && <RecipeCookingCard />}
                        {filteredRecipes.map((recipe, index) => (
                            <RecipeCard
                                key={recipe.recipeId}
                                recipe={recipe}
                                onDelete={deleteRecipe}
                                accentIndex={index}
                            />
                        ))}
                    </section>
                ) : recipes.length > 0 ? (
                    <section className="Dashboard__noResults">
                        <p>No recipes match your search.</p>
                        <button className="Dashboard__emptyButton" onClick={clearFilters}>
                            Clear filters
                        </button>
                    </section>
                ) : (
                    <section className="Dashboard__empty">
                        <div className="Dashboard__emptyIllustration" aria-hidden="true">
                            <span />
                        </div>
                        <h2>No recipes yet!</h2>
                        <p>Paste your first link above and let the magic happen</p>
                        <button className="Dashboard__emptyButton" onClick={focusFirstRecipeInput}>
                            Add my first recipe →
                        </button>
                    </section>
                )}
            </div>
        </div>
    );
}
