import Joi from "joi";

export class RecipeModel {
    public recipeId?:     number;
    public userId:        number;
    public title:         string;
    public linkUrl:       string;
    public platform:      "tiktok" | "instagram" | "facebook";
    public ingredients?:  object;
    public instructions?: string;
    public servings?:     string;
    public thumbnail?:    string;
    public totalCalories?:     number;
    public caloriesPerServing?: number;
    public protein?:      number;
    public carbs?:        number;
    public fats?:         number;
    public proteinPerServing?: number;
    public carbsPerServing?: number;
    public fatsPerServing?: number;
    public savedAt?:      Date;

    private static schema = Joi.object({
        recipeId:     Joi.number().optional().positive().integer(),
        userId:       Joi.number().required().positive().integer(),
        title:        Joi.string().required().min(2).max(255),
        linkUrl:      Joi.string().uri().required(),
        platform:     Joi.string().valid("tiktok", "instagram", "facebook").required(),
        ingredients:  Joi.object().optional(),
        instructions: Joi.string().optional(),
        servings:     Joi.string().optional().max(50),
        thumbnail:    Joi.string().uri().optional(),
        totalCalories: Joi.number().optional().positive(),
        caloriesPerServing: Joi.number().optional().positive(),
        protein: Joi.number().optional().min(0).max(250),
        carbs: Joi.number().optional().min(0).max(250),
        fats: Joi.number().optional().min(0).max(250),
        proteinPerServing: Joi.number().optional().min(0).max(250),
        carbsPerServing: Joi.number().optional().min(0).max(250),
        fatsPerServing: Joi.number().optional().min(0).max(250),
        savedAt:      Joi.date().optional(),
    });

    public constructor(recipe: RecipeModel) {
        this.recipeId     = recipe.recipeId;
        this.userId       = recipe.userId;
        this.title        = recipe.title;
        this.linkUrl      = recipe.linkUrl;
        this.platform     = recipe.platform;
        this.ingredients  = recipe.ingredients;
        this.instructions = recipe.instructions;
        this.servings     = recipe.servings;
        this.thumbnail    = recipe.thumbnail;
        this.totalCalories = recipe.totalCalories;
        this.caloriesPerServing = recipe.caloriesPerServing;
        this.protein      = recipe.protein;
        this.carbs        = recipe.carbs;
        this.fats         = recipe.fats;
        this.proteinPerServing = recipe.proteinPerServing;
        this.carbsPerServing = recipe.carbsPerServing;
        this.fatsPerServing = recipe.fatsPerServing;
        this.savedAt      = recipe.savedAt;
    }

    public validate(): void {
        const result = RecipeModel.schema.validate(this);
        if (result.error) throw new Error(result.error.message);
    }
}