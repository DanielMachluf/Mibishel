import { NextFunction, Request, Response } from "express";
import { appConfig } from "../2-utils/app-config";
import { RouteNotFoundError } from "../3-models/client-errors";
import { StatusCode } from "../3-models/enums";

class ErrorsMiddleware {

    public catchAll(err: any, request: Request, response: Response, next: NextFunction) {
        console.error(err);
        const status = err.status || StatusCode.InternalServerError;
        const isServerError = status >= 500 && status <= 599;
        const message = appConfig.isProduction && isServerError ? "Some error, please try again." : err.message;
        response.status(status).json({ message });
    }

    public routeNotFound(request: Request, response: Response, next: NextFunction) {
        next(new RouteNotFoundError(request.originalUrl));
    }

}

export const errorsMiddleware = new ErrorsMiddleware();
