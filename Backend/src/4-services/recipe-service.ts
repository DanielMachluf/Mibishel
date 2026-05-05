import { OkPacket, RowDataPacket } from "mysql2";
import { appConfig } from "../2-utils/app-config";
import { dal } from "../2-utils/dal";
import { parseN8nResponse, safeParseJson } from "../2-utils/n8n-parser";
import { ResourceNotFoundError, ValidationError } from "../3-models/client-errors";
import { RecipeModel } from "../3-models/recipe-model";

type RecipePlatform = RecipeModel["platform"];
type RecipeIngredients = string[];

interface N8nRecipeResponse {
    title: string;
    linkUrl: string;
    platform: string;
    ingredients: RecipeIngredients;
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
}

interface RecipeRow extends RowDataPacket {
    recipeId: number;
    userId: number;
    title: string;
    linkUrl: string;
    platform: RecipePlatform;
    ingredients: string;
    instructions: string | null;
    servings: string | null;
    thumbnail: string | null;
    totalCalories: number | null;
    caloriesPerServing: number | null;
    protein: number | null;
    carbs: number | null;
    fats: number | null;
    proteinPerServing: number | null;
    carbsPerServing: number | null;
    fatsPerServing: number | null;
    savedAt: Date;
}

class RecipeService {

    public async scrapeAndSave(linkUrl: string, userId: number): Promise<RecipeModel> {

        // Ask n8n to scrape the social link and return one recipe object.
        const scrapedRecipe = await this.getRecipeFromN8n(linkUrl);

        // DB stores platform lowercase and ingredients as JSON text.
        const platform = this.normalizePlatform(scrapedRecipe.platform);
        const ingredients = JSON.stringify(scrapedRecipe.ingredients);

        const sql = `
            insert into recipes(userId, title, linkUrl, platform, ingredients, instructions, servings, thumbnail, totalCalories, caloriesPerServing, protein, carbs, fats, proteinPerServing, carbsPerServing, fatsPerServing)
            values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            userId,
            scrapedRecipe.title,
            scrapedRecipe.linkUrl,
            platform,
            ingredients,
            scrapedRecipe.instructions,
            scrapedRecipe.servings,
            scrapedRecipe.thumbnail,
            scrapedRecipe.totalCalories,
            scrapedRecipe.caloriesPerServing,
            scrapedRecipe.protein,
            scrapedRecipe.carbs,
            scrapedRecipe.fats,
            scrapedRecipe.proteinPerServing,
            scrapedRecipe.carbsPerServing,
            scrapedRecipe.fatsPerServing
        ];

        const result = await dal.execute(sql, values) as OkPacket;
        const recipe = await this.getRecipeById(result.insertId, userId);
        return recipe;
    }

    public async getAllRecipes(userId: number): Promise<RecipeModel[]> {
        const sql = "select * from recipes where userId = ? order by savedAt desc";
        const values = [userId];
        const rows = await dal.execute(sql, values) as RowDataPacket[];
        const recipes = rows.map(row => this.convertRowToRecipe(row as RecipeRow));
        return recipes;
    }

    public async getRecipeById(recipeId: number, userId: number): Promise<RecipeModel> {
        const sql = "select * from recipes where recipeId = ? and userId = ?";
        const values = [recipeId, userId];
        const rows = await dal.execute(sql, values) as RowDataPacket[];
        const recipeRow = rows[0] as RecipeRow | undefined;

        if (!recipeRow) throw new ResourceNotFoundError(recipeId);

        const recipe = this.convertRowToRecipe(recipeRow);
        return recipe;
    }

    public async updateRecipe(recipeId: number, userId: number, updates: Partial<RecipeModel>): Promise<RecipeModel> {

        // Verify ownership before updating.
        await this.getRecipeById(recipeId, userId);

        type EditableField = "title" | "instructions" | "servings" | "thumbnail" |
            "totalCalories" | "caloriesPerServing" |
            "protein" | "carbs" | "fats" |
            "proteinPerServing" | "carbsPerServing" | "fatsPerServing" | "ingredients";

        const allowedFields: EditableField[] = [
            "title", "instructions", "servings", "thumbnail",
            "totalCalories", "caloriesPerServing",
            "protein", "carbs", "fats",
            "proteinPerServing", "carbsPerServing", "fatsPerServing", "ingredients"
        ];

        const setClauses: string[] = [];
        const values: (string | number | null)[] = [];

        for (const field of allowedFields) {
            if (!(field in updates)) continue;
            if (field === "ingredients") {
                setClauses.push("ingredients = ?");
                values.push(JSON.stringify(updates.ingredients));
            } else {
                setClauses.push(`${field} = ?`);
                const raw = updates[field as keyof Partial<RecipeModel>];
                values.push(raw === undefined ? null : (raw as string | number | null));
            }
        }

        if (setClauses.length === 0) throw new ValidationError("No valid fields to update.");

        values.push(recipeId, userId);
        const sql = `update recipes set ${setClauses.join(", ")} where recipeId = ? and userId = ?`;
        await dal.execute(sql, values) as OkPacket;

        return this.getRecipeById(recipeId, userId);
    }

    public async deleteRecipe(recipeId: number, userId: number): Promise<void> {

        // Verify ownership before deleting.
        await this.getRecipeById(recipeId, userId);

        const sql = "delete from recipes where recipeId = ? and userId = ?";
        const values = [recipeId, userId];
        await dal.execute(sql, values) as OkPacket;
    }

    private async getRecipeFromN8n(linkUrl: string): Promise<N8nRecipeResponse> {
        if (!appConfig.n8nWebhookUrl) throw new Error("Missing n8n webhook url configuration.");

        const response = await fetch(appConfig.n8nWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkUrl })
        });

        if (!response.ok) throw new Error("Failed to scrape recipe.");

        // Delegate all response-shape complexity to the n8n parser utility.
        const raw = await response.text();
        const recipe = parseN8nResponse<N8nRecipeResponse>(raw);
        this.validateN8nRecipe(recipe);
        return recipe;
    }

    private validateN8nRecipe(recipe: N8nRecipeResponse): void {
        if (!recipe.title) throw new ValidationError("Recipe title is missing.");
        if (!recipe.linkUrl) throw new ValidationError("Recipe link url is missing.");
        if (!recipe.platform) throw new ValidationError("Recipe platform is missing.");
        if (!Array.isArray(recipe.ingredients)) throw new ValidationError("Recipe ingredients must be an array.");

        const nutritionFields = ["protein", "carbs", "fats", "proteinPerServing", "carbsPerServing", "fatsPerServing"] as const;

        for (const fieldName of nutritionFields) {
            const value = recipe[fieldName];

            if (typeof value !== "number" || Number.isNaN(value)) {
                throw new ValidationError(`Recipe ${fieldName} must be a number.`);
            }

            if (value < 0 || value > 600) {
                throw new ValidationError(`Recipe ${fieldName} must be between 0 and 600.`);
            }
        }
    }

    private normalizePlatform(platform: string): RecipePlatform {
        const normalizedPlatform = platform.toLowerCase();

        if (normalizedPlatform !== "tiktok" && normalizedPlatform !== "instagram" && normalizedPlatform !== "facebook") {
            throw new ValidationError("Unsupported recipe platform.");
        }

        return normalizedPlatform;
    }

    private convertRowToRecipe(row: RecipeRow): RecipeModel {

        // DB stores ingredients as JSON text; safeParseJson handles malformed legacy rows.
        const ingredients = safeParseJson<RecipeIngredients>(row.ingredients, []);

        const recipe = new RecipeModel({
            recipeId: row.recipeId,
            userId: row.userId,
            title: row.title,
            linkUrl: row.linkUrl,
            platform: row.platform,
            ingredients: ingredients as unknown as object,
            instructions: row.instructions ?? undefined,
            servings: row.servings ?? undefined,
            thumbnail: row.thumbnail ?? undefined,
            totalCalories: row.totalCalories ?? undefined,
            caloriesPerServing: row.caloriesPerServing ?? undefined,
            protein: row.protein ?? undefined,
            carbs: row.carbs ?? undefined,
            fats: row.fats ?? undefined,
            proteinPerServing: row.proteinPerServing ?? undefined,
            carbsPerServing: row.carbsPerServing ?? undefined,
            fatsPerServing: row.fatsPerServing ?? undefined,
            savedAt: row.savedAt
        } as RecipeModel);

        return recipe;
    }
}

export const service = new RecipeService();
