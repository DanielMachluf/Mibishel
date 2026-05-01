export interface RecipeModel {
    recipeId: number;
    userId: number;
    title: string;
    linkUrl: string;
    platform: "tiktok" | "instagram" | "facebook";
    ingredients: string[];
    instructions: string;
    servings: string;
    thumbnail: string;
    totalCalories: number;
    caloriesPerServing: number;
    protein: number;
    carbs: number;
    fats: number;
    proteinPerServing: number;
    carbsPerServing: number;
    fatsPerServing: number;
    savedAt: Date;
}
