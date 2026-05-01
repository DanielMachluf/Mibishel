import joi from "joi";
import { ValidationError } from "./client-errors";

export class CredentialsModel {
    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    private static schema = joi.object({
        email: joi.string().required().email(),
        password: joi.string().required().min(2).max(30),
    });

    public validate(): void {
        const result = CredentialsModel.schema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}
