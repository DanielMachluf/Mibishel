import Joi from "joi";
import { ValidationError } from "./client-errors";

// ---------------------------------------------------------------------------
// RecipeContext
// ---------------------------------------------------------------------------

/**
 * The slice of recipe data the client sends alongside the question.
 *
 * WHY a plain interface and not a class?
 * RecipeContext is a nested value object — it has no behaviour of its own.
 * Its validation is owned entirely by AskAiModel's Joi schema below, so a
 * lightweight interface is the right fit here.
 *
 * Only title + ingredients are required — the AI can still answer useful
 * questions with just those two. Everything else is optional enrichment.
 */
export interface RecipeContext {
    recipeId?:          number;
    title:              string;
    ingredients:        string[];
    instructions?:      string;
    servings?:          number | string;
    caloriesPerServing?: number;
    proteinPerServing?:  number;
    carbsPerServing?:    number;
    fatsPerServing?:     number;
    totalCalories?:      number;
    protein?:            number;
    carbs?:              number;
    fats?:               number;
}

// ---------------------------------------------------------------------------
// AskAiModel
// ---------------------------------------------------------------------------

/**
 * Represents one "ask the AI about a recipe" request.
 *
 * Follows the exact same pattern as RecipeModel and CredentialsModel:
 *  - Public fields        → the data carried by this request
 *  - Private Joi schema   → all validation rules in one place
 *  - Constructor          → copies incoming data onto the instance
 *  - validate()           → throws ValidationError on bad input
 *
 * WHY keep validation here and not in the service?
 * The model owns the shape of the data — it is the single source of truth
 * for what a valid "ask AI" request looks like. The service should only
 * receive clean, already-validated data, keeping its job focused purely
 * on calling n8n and returning the answer.
 */
export class AskAiModel {
    public question: string;
    public recipe:   RecipeContext;

    private static schema = Joi.object({
        question: Joi.string().required().min(1).max(500).trim(),

        recipe: Joi.object({
            recipeId:           Joi.number().optional().positive().integer(),
            title:              Joi.string().required().min(1).max(255),
            ingredients:        Joi.array().items(Joi.string()).min(1).required(),
            instructions:       Joi.string().optional().allow(""),
            servings:           Joi.alternatives().try(Joi.number(), Joi.string()).optional(),

            // Nutrition totals for the whole recipe
            totalCalories:      Joi.number().optional().min(0).max(600),
            protein:            Joi.number().optional().min(0).max(600),
            carbs:              Joi.number().optional().min(0).max(600),
            fats:               Joi.number().optional().min(0).max(600),

            // Nutrition per serving
            caloriesPerServing: Joi.number().optional().min(0).max(600),
            proteinPerServing:  Joi.number().optional().min(0).max(600),
            carbsPerServing:    Joi.number().optional().min(0).max(600),
            fatsPerServing:     Joi.number().optional().min(0).max(600),
        }).required()
    });

    public constructor(model: AskAiModel) {
        this.question = model.question;
        this.recipe   = model.recipe;
    }

    public validate(): void {
        const result = AskAiModel.schema.validate(this, { abortEarly: true });
        if (result.error) throw new ValidationError(result.error.message);
    }
}
