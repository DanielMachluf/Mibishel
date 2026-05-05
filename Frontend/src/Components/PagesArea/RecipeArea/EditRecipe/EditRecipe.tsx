import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import type { RecipeModel } from "../../../../Models/recipe-model";
import { recipeService } from "../../../../Services/RecipeService";
import { notify } from "../../../../Utils/Notify";
import foodBg from "../../../../assets/PNG/—Pngtree—frame background food_16557148.png";
import "./EditRecipe.css";

interface IngredientField {
    value: string;
}

interface EditFormValues {
    title: string;
    servings: string;
    thumbnail: string;
    instructions: string;
    ingredients: IngredientField[];
    totalCalories: number;
    caloriesPerServing: number;
    protein: number;
    carbs: number;
    fats: number;
    proteinPerServing: number;
    carbsPerServing: number;
    fatsPerServing: number;
}

export function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState<RecipeModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        control,
        formState: { errors, isDirty },
    } = useForm<EditFormValues>();

    const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });

    const thumbnailValue = watch("thumbnail");

    const blocker = useBlocker(isDirty && !isSaving);

    useEffect(() => {
        const recipeId = Number(id);
        if (!Number.isInteger(recipeId) || recipeId <= 0) {
            notify.error("Invalid recipe.");
            navigate(-1);
            return;
        }

        recipeService
            .getRecipeById(recipeId)
            .then(r => {
                setRecipe(r);
                reset({
                    title: r.title,
                    servings: r.servings,
                    thumbnail: r.thumbnail,
                    instructions: r.instructions,
                    ingredients: (Array.isArray(r.ingredients) ? r.ingredients : []).map(v => ({ value: v })),
                    totalCalories: r.totalCalories,
                    caloriesPerServing: r.caloriesPerServing,
                    protein: r.protein,
                    carbs: r.carbs,
                    fats: r.fats,
                    proteinPerServing: r.proteinPerServing,
                    carbsPerServing: r.carbsPerServing,
                    fatsPerServing: r.fatsPerServing,
                });
                setIsLoading(false);
            })
            .catch(err => {
                notify.error(err);
                navigate(-1);
            });
    }, [id]);

    function handleImageFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setValue("thumbnail", reader.result as string, { shouldDirty: true });
        reader.readAsDataURL(file);
        // reset so the same file can be re-selected
        e.target.value = "";
    }

    async function onSubmit(values: EditFormValues) {
        setIsSaving(true);
        try {
            const ingredients = values.ingredients.map(i => i.value).filter(Boolean);

            await recipeService.updateRecipe(Number(id), {
                title: values.title,
                servings: values.servings,
                thumbnail: values.thumbnail,
                instructions: values.instructions,
                ingredients: ingredients as unknown as string[],
                totalCalories: values.totalCalories,
                caloriesPerServing: values.caloriesPerServing,
                protein: values.protein,
                carbs: values.carbs,
                fats: values.fats,
                proteinPerServing: values.proteinPerServing,
                carbsPerServing: values.carbsPerServing,
                fatsPerServing: values.fatsPerServing,
            });
            notify.success("Recipe updated!");
            navigate(`/recipe/${id}`);
        } catch (err) {
            notify.error(err);
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return (
            <div className="EditRecipe EditRecipe--loading">
                <span className="EditRecipe__spinner" />
            </div>
        );
    }

    return (
        <>
            {/* ── Unsaved-changes guard ── */}
            {blocker.state === "blocked" && (
                <div className="EditRecipe__overlay" role="dialog" aria-modal="true" aria-labelledby="er-blocker-title">
                    <div className="EditRecipe__dialog">
                        <div className="EditRecipe__dialogIcon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            </svg>
                        </div>
                        <h2 id="er-blocker-title" className="EditRecipe__dialogTitle">Unsaved changes</h2>
                        <p className="EditRecipe__dialogBody">
                            Your edits haven't been saved yet.<br />Leaving now will discard them.
                        </p>
                        <div className="EditRecipe__dialogActions">
                            <button className="EditRecipe__dialogLeave" onClick={() => blocker.proceed()}>
                                Leave anyway
                            </button>
                            <button className="EditRecipe__dialogStay" onClick={() => blocker.reset()}>
                                Stay
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="EditRecipe">
                {/* ── Left panel ── */}
                <aside className="EditRecipe__imageSide" aria-hidden="true">
                    <div className="EditRecipe__imageFrame">
                        <img src={foodBg} alt="" className="EditRecipe__bg" />
                        <div className="EditRecipe__imageGlass" />
                    </div>
                    <div className="EditRecipe__imageMeta">
                        <span className="EditRecipe__imageBadge">Editing recipe</span>
                        <h2 className="EditRecipe__imageTitle">{recipe?.title}</h2>
                        <p className="EditRecipe__imageSub">Make your changes and save when ready.</p>
                    </div>
                    <div className="EditRecipe__imageDots" />
                </aside>

                {/* ── Right panel ── */}
                <main className="EditRecipe__formSide">
                    <button
                        className="EditRecipe__back"
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                    >
                        <span aria-hidden="true">←</span> Back
                    </button>

                    <header className="EditRecipe__header">
                        <h1>Edit Recipe</h1>
                        <p>Update any field below and hit <strong>Save Changes</strong>.</p>
                    </header>

                    <form className="EditRecipe__form" onSubmit={handleSubmit(onSubmit)} noValidate>

                        {/* ── Basic Info ── */}
                        <fieldset className="EditRecipe__fieldset" style={{ animationDelay: "0ms" }}>
                            <legend>Basic Info</legend>

                            <label className="EditRecipe__label">
                                <span>Title</span>
                                <input
                                    className={errors.title ? "EditRecipe__input EditRecipe__input--error" : "EditRecipe__input"}
                                    {...register("title", { required: "Title is required" })}
                                    placeholder="Recipe title"
                                />
                                {errors.title && <em className="EditRecipe__error">{errors.title.message}</em>}
                            </label>

                            <div className="EditRecipe__row">
                                <label className="EditRecipe__label">
                                    <span>Servings</span>
                                    <input className="EditRecipe__input" {...register("servings")} placeholder="e.g. 4" />
                                </label>
                                <label className="EditRecipe__label">
                                    <span>Calories (total)</span>
                                    <input className="EditRecipe__input" type="number" step="1" {...register("totalCalories", { valueAsNumber: true })} />
                                </label>
                                <label className="EditRecipe__label">
                                    <span>Calories / serving</span>
                                    <input className="EditRecipe__input" type="number" step="1" {...register("caloriesPerServing", { valueAsNumber: true })} />
                                </label>
                            </div>

                            {/* Thumbnail */}
                            <div className="EditRecipe__thumbnailGroup">
                                <label className="EditRecipe__label">
                                    <span>Thumbnail</span>
                                    <div className="EditRecipe__thumbnailInputRow">
                                        <input
                                            className="EditRecipe__input"
                                            {...register("thumbnail")}
                                            placeholder="https://... or upload below"
                                        />
                                        <button
                                            type="button"
                                            className="EditRecipe__uploadBtn"
                                            onClick={() => fileInputRef.current?.click()}
                                            title="Upload image from device"
                                        >
                                            ↑ Upload
                                        </button>
                                    </div>
                                </label>

                                {/* hidden file input — works on desktop and mobile */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="EditRecipe__fileInput"
                                    onChange={handleImageFile}
                                />

                                {thumbnailValue && (
                                    <div className="EditRecipe__thumbnailPreview">
                                        <img
                                            src={thumbnailValue}
                                            alt="Thumbnail preview"
                                            className="EditRecipe__thumbnailImg"
                                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                            onLoad={e => { (e.currentTarget as HTMLImageElement).style.display = "block"; }}
                                        />
                                        <span className="EditRecipe__thumbnailLabel">Preview</span>
                                    </div>
                                )}
                            </div>
                        </fieldset>

                        {/* ── Nutrition ── */}
                        <fieldset className="EditRecipe__fieldset" style={{ animationDelay: "60ms" }}>
                            <legend>Nutrition</legend>

                            <div className="EditRecipe__row">
                                <label className="EditRecipe__label">
                                    <span>Protein (g)</span>
                                    <input className="EditRecipe__input" type="number" step="0.1" {...register("protein", { valueAsNumber: true })} />
                                </label>
                                <label className="EditRecipe__label">
                                    <span>Carbs (g)</span>
                                    <input className="EditRecipe__input" type="number" step="0.1" {...register("carbs", { valueAsNumber: true })} />
                                </label>
                                <label className="EditRecipe__label">
                                    <span>Fats (g)</span>
                                    <input className="EditRecipe__input" type="number" step="0.1" {...register("fats", { valueAsNumber: true })} />
                                </label>
                            </div>

                            <div className="EditRecipe__row">
                                <label className="EditRecipe__label">
                                    <span>Protein / serving</span>
                                    <input className="EditRecipe__input" type="number" step="0.1" {...register("proteinPerServing", { valueAsNumber: true })} />
                                </label>
                                <label className="EditRecipe__label">
                                    <span>Carbs / serving</span>
                                    <input className="EditRecipe__input" type="number" step="0.1" {...register("carbsPerServing", { valueAsNumber: true })} />
                                </label>
                                <label className="EditRecipe__label">
                                    <span>Fats / serving</span>
                                    <input className="EditRecipe__input" type="number" step="0.1" {...register("fatsPerServing", { valueAsNumber: true })} />
                                </label>
                            </div>
                        </fieldset>

                        {/* ── Ingredients ── */}
                        <fieldset className="EditRecipe__fieldset" style={{ animationDelay: "120ms" }}>
                            <legend>Ingredients</legend>

                            <ul className="EditRecipe__ingredientList">
                                {fields.map((field, index) => (
                                    <li key={field.id} className="EditRecipe__ingredientRow">
                                        <span className="EditRecipe__ingredientNum">{index + 1}</span>
                                        <input
                                            className="EditRecipe__input EditRecipe__ingredientInput"
                                            {...register(`ingredients.${index}.value`)}
                                            placeholder="e.g. 1 cup flour"
                                        />
                                        <button
                                            type="button"
                                            className="EditRecipe__removeBtn"
                                            onClick={() => remove(index)}
                                            aria-label={`Remove ingredient ${index + 1}`}
                                        >
                                            ×
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="EditRecipe__addBtn"
                                onClick={() => append({ value: "" })}
                            >
                                + Add ingredient
                            </button>
                        </fieldset>

                        {/* ── Instructions ── */}
                        <fieldset className="EditRecipe__fieldset" style={{ animationDelay: "180ms" }}>
                            <legend>Instructions</legend>
                            <label className="EditRecipe__label">
                                <span>One step per line</span>
                                <textarea
                                    className="EditRecipe__textarea"
                                    rows={10}
                                    {...register("instructions")}
                                    placeholder={"Mix all dry ingredients.\nAdd wet ingredients and stir.\nCook for 20 minutes."}
                                />
                            </label>
                        </fieldset>

                        <div className="EditRecipe__actions">
                            <button
                                className="EditRecipe__saveBtn"
                                type="submit"
                                disabled={isSaving || !isDirty}
                            >
                                {isSaving ? (
                                    <><span className="EditRecipe__btnSpinner" />Saving…</>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                            <button
                                className="EditRecipe__cancelBtn"
                                type="button"
                                onClick={() => navigate(-1)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
