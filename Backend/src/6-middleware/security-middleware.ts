import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { cyber } from "../2-utils/cyber";
import { UnauthorizedError } from "../3-models/client-errors";
import striptags from "striptags";

class SecurityMiddleware {

    // Rate limiter for auth routes (register / login):
    public authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 20,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: { message: "Too many requests, please try again later." },
    });

    // Rate limiter for n8n webhook routes (scrape / ask-AI):
    public webhookLimiter = rateLimit({
        windowMs: 60 * 1000, // 1 minute
        limit: 10,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: { message: "Too many requests, please slow down." },
    });

    // Verify legal token:
    public verifyToken(request: Request, response: Response, next: NextFunction): void {

        // Extract token: 
        const token = cyber.extractToken(request);

        // If token not legal:
        if (!cyber.verifyToken(token)) {
            next(new UnauthorizedError("You are not logged-in."));
            return;
        }

        // All is good: 
        next();
    }

    // Verify admin:
    public verifyAdmin(request: Request, response: Response, next: NextFunction): void {

        // Extract token: 
        const token = cyber.extractToken(request);

        // If user is not admin:
        if (!cyber.verifyAdmin(token)) {
            next(new UnauthorizedError("You are not authorized."));
            return;
        }

        // All is good: 
        next();
    }

    // Verify me:
    public verifyMe(request: Request, response: Response, next: NextFunction): void {

        // Extract token: 
        const token = cyber.extractToken(request);

        // Get token user id: 
        const tokenUserId = cyber.getTokenUserId(token);
        const routeId = +request.params.id;

        // If not the same: 
        if(tokenUserId !== routeId) {
            next(new UnauthorizedError("You are not authorized."));
            return;
        }

        // All is good: 
        next();
    }

    // Prevent XSS attack:
    public preventXss(request: Request, response: Response, next: NextFunction): void {

        // Run on body object:
        for (const prop in request.body) {
            const value = request.body[prop];
            if (typeof value === "string") {
                request.body[prop] = striptags(value); // <script>something</script> --> something
            }
        }

        next(); // Continue the request
    }

}

export const securityMiddleware = new SecurityMiddleware();
