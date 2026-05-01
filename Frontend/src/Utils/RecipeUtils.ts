import type { RecipeModel } from "../Models/recipe-model";

/**
 * Normalises a raw RecipeModel received from the API.
 *
 * The backend marks several columns as nullable (instructions, servings,
 * thumbnail, totalCalories, caloriesPerServing, protein, carbs, fats,
 * proteinPerServing, carbsPerServing, fatsPerServing). This helper
 * replaces nulls with safe defaults so components never have to guard
 * against undefined/null on individual fields.
 *
 * Also coerces savedAt from a raw ISO string back into a proper Date object,
 * since JSON serialisation strips the Date type.
 */
export function normalizeRecipe(recipe: RecipeModel): RecipeModel {
    return {
        ...recipe,
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
        instructions: recipe.instructions ?? "",
        servings: recipe.servings ?? "",
        thumbnail: recipe.thumbnail ?? "",
        totalCalories: recipe.totalCalories ?? 0,
        caloriesPerServing: recipe.caloriesPerServing ?? 0,
        protein: recipe.protein ?? 0,
        carbs: recipe.carbs ?? 0,
        fats: recipe.fats ?? 0,
        proteinPerServing: recipe.proteinPerServing ?? 0,
        carbsPerServing: recipe.carbsPerServing ?? 0,
        fatsPerServing: recipe.fatsPerServing ?? 0,
        savedAt: new Date(recipe.savedAt)
    };
}
