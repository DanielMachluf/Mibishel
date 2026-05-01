import express, { NextFunction, Request, Response, Router } from "express";
import { cyber } from "../2-utils/cyber";
import { StatusCode } from "../3-models/enums";
import { service as recipeService } from "../4-services/recipe-service";
import { securityMiddleware } from "../6-middleware/security-middleware";

class RecipeController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/recipes/scrape", securityMiddleware.verifyToken, securityMiddleware.webhookLimiter, securityMiddleware.preventXss, this.scrapeAndSave);
        this.router.get("/api/recipes", securityMiddleware.verifyToken, this.getAllRecipes);
        this.router.get("/api/recipes/:id", securityMiddleware.verifyToken, this.getRecipeById);
        this.router.delete("/api/recipes/:id", securityMiddleware.verifyToken, this.deleteRecipe);
    }

    private scrapeAndSave = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { linkUrl } = request.body as { linkUrl: string };
            const userId = this.getUserId(request);
            const recipe = await recipeService.scrapeAndSave(linkUrl, userId);
            response.status(StatusCode.Created).json(recipe);
        }
        catch (err: unknown) {
            next(err);
        }
    };

    private getAllRecipes = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const userId = this.getUserId(request);
            const recipes = await recipeService.getAllRecipes(userId);
            response.status(StatusCode.OK).json(recipes);
        }
        catch (err: unknown) {
            next(err);
        }
    };

    private getRecipeById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const recipeId = +request.params.id;
            const userId = this.getUserId(request);
            const recipe = await recipeService.getRecipeById(recipeId, userId);
            response.status(StatusCode.OK).json(recipe);
        }
        catch (err: unknown) {
            next(err);
        }
    };

    private deleteRecipe = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const recipeId = +request.params.id;
            const userId = this.getUserId(request);
            await recipeService.deleteRecipe(recipeId, userId);
            response.sendStatus(StatusCode.NoContent);
        }
        catch (err: unknown) {
            next(err);
        }
    };

    private getUserId(request: Request): number {
        const token = cyber.extractToken(request);
        const userId = cyber.getTokenUserId(token);
        return userId;
    }
}

export const recipeController = new RecipeController();
