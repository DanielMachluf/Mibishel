import axios from "axios";
import type { RecipeModel } from "../Models/recipe-model";
import { appConfig } from "../Utils/AppConfig";
import { createAuthConfig } from "../Utils/AuthConfig";
import { normalizeRecipe } from "../Utils/RecipeUtils";

class RecipeService {
    public async scrapeAndSave(linkUrl: string): Promise<RecipeModel> {
        const response = await axios.post<RecipeModel>(
            `${appConfig.apiUrl}/recipes/scrape`,
            { linkUrl },
            createAuthConfig()
        );
        return normalizeRecipe(response.data);
    }

    public async getAllRecipes(): Promise<RecipeModel[]> {
        const response = await axios.get<RecipeModel[]>(`${appConfig.apiUrl}/recipes`, createAuthConfig());
        return response.data.map(recipe => normalizeRecipe(recipe));
    }

    public async getRecipeById(id: number): Promise<RecipeModel> {
        const response = await axios.get<RecipeModel>(`${appConfig.apiUrl}/recipes/${id}`, createAuthConfig());
        return normalizeRecipe(response.data);
    }

    public async deleteRecipe(id: number): Promise<void> {
        await axios.delete(`${appConfig.apiUrl}/recipes/${id}`, createAuthConfig());
    }

    public async updateRecipe(id: number, data: Partial<RecipeModel>): Promise<RecipeModel> {
        const response = await axios.put<RecipeModel>(`${appConfig.apiUrl}/recipes/${id}`, data, createAuthConfig());
        return normalizeRecipe(response.data);
    }

}

export const recipeService = new RecipeService();
