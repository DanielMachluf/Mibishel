export interface RecipeContext {
    recipeId?: number;
    title: string;
    ingredients: string[];
    instructions?: string;
    servings?: number | string;
    caloriesPerServing?: number;
    proteinPerServing?: number;
    carbsPerServing?: number;
    fatsPerServing?: number;
    totalCalories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
}

export interface AskAiRequest {
    question: string;
    recipe: RecipeContext;
}

export interface AskAiResponse {
    answer: string;
}
