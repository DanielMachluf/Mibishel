import express, { NextFunction, Request, Response, Router } from "express";
import { StatusCode } from "../3-models/enums";
import { CredentialsModel } from "../3-models/credentials-model";
import { UserModel } from "../3-models/user-model";
import { service as userService } from "../4-services/user-service";
import { securityMiddleware } from "../6-middleware/security-middleware";

class UserController {
    public router: Router = express.Router();

    public constructor() {
        this.router.post("/api/register", securityMiddleware.authLimiter, securityMiddleware.preventXss, this.register);
        this.router.post("/api/login", securityMiddleware.authLimiter, securityMiddleware.preventXss, this.login);
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = new UserModel(request.body);
            const token = await userService.register(user);
            response.status(StatusCode.Created).json(token);
        }
        catch (err: any) {
            next(err);
        }
    };

    private login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const credentials = new CredentialsModel(request.body);
            const token = await userService.login(credentials);
            response.status(StatusCode.OK).json(token);
        }
        catch (err: any) {
            next(err);
        }
    };
}

export const userController = new UserController();
