import Joi from "joi";

export class UserModel {
    public userId?: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public role: string;

    private static schema = Joi.object({
        userId: Joi.number().optional().positive().integer(),
        firstName: Joi.string().required().min(2).max(30),
        lastName: Joi.string().required().min(2).max(30),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(2).max(30),
        role: Joi.string().optional().min(2).max(30),
    });

    public constructor(user: UserModel) {
        this.userId = user.userId;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
    }

    public validate(): void {
        const result = UserModel.schema.validate(this);
        if (result.error) throw new Error(result.error.message);
    }
}
