import express, { NextFunction, Request, Response, Router } from "express";
import { StatusCode } from "../3-models/enums";
import { AskAiModel } from "../3-models/ai-model";
import { aiService } from "../4-services/ai-service";
import { securityMiddleware } from "../6-middleware/security-middleware";

class AiController {
    public router: Router = express.Router();

    public constructor() {
        // POST /api/recipes/ask
        //
        // verifyToken  — user must be logged in; userId lives in the JWT so
        //                the client never needs to send it explicitly.
        // preventXss   — strips injected HTML/script tags before the model
        //                receives the data.
        this.router.post(
            "/api/recipes/ask",
            securityMiddleware.verifyToken,
            securityMiddleware.webhookLimiter,
            securityMiddleware.preventXss,
            this.askAboutRecipe
        );
    }

    /**
     * POST /api/recipes/ask
     *
     * Request body:
     * {
     *   "question": "Can I replace the eggs?",
     *   "recipe": {
     *     "recipeId": 12,
     *     "title": "Protein Pancakes",
     *     "ingredients": ["eggs", "banana", "protein powder"],
     *     "instructions": "Mix and cook",
     *     "servings": 2,
     *     "caloriesPerServing": 270,
     *     "proteinPerServing": 16
     *   }
     * }
     *
     * Response 200:
     * { "answer": "Yes, you can substitute eggs with a flax egg..." }
     *
     * WHY construct and validate the model here?
     * The controller is the HTTP entry point — its job is to receive raw data
     * and turn it into a validated domain object before handing off to the
     * service. The service only ever sees clean, trusted data.
     */
    private askAboutRecipe = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const model = new AskAiModel(request.body as AskAiModel);
            model.validate(); // Throws ValidationError → caught by errorsMiddleware

            const answer = await aiService.askAboutRecipe(model);

            response.status(StatusCode.OK).json({ answer });
        }
        catch (err: unknown) {
            next(err);
        }
    };
}

export const aiController = new AiController();

