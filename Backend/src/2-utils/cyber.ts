import crypto from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { Role } from "../3-models/enums";
import { appConfig } from "./app-config";
import { Request } from "express";
import { UserModel } from "../3-models/user-model";


class Cyber {

    public hash(plainText: string): string {

        // SHA: Secure Hashing Algorithm
        // HMAC: Hash-based Message Authentication Code

        // Hash without salting: 
        // const hashText = crypto.createHash("sha512").update(plainText).digest("hex");

        // Hash with salting: 
        if (!appConfig.hashSalt) throw new Error("Missing hash salt configuration.");
        const hashText = crypto.createHmac("sha512", appConfig.hashSalt).update(plainText).digest("hex");

        // Return hash:
        return hashText;
    }

    public generateToken(user: UserModel): string {

        // Remove password: 
        delete (user as any).password;

        // Create payload: 
        const payload = { user };

        // Create options: 
        const options: SignOptions = { expiresIn: "3h" };

        // Generate token: 
        if (!appConfig.jwtSecret) throw new Error("Missing JWT secret configuration.");
        const token = jwt.sign(payload, appConfig.jwtSecret, options);

        // Return token: 
        return token;
    }

    // Extract token:
    public extractToken(request: Request): string {
        // Authorization: Bearer the-token...
        //                       -->
        //                01234567
        const authorization = request.headers.authorization;
        const token = authorization?.substring(7)!;
        return token;
    }

    // Verify legal token:
    public verifyToken(token: string): boolean {
        try {
            if (!token) return false;
            if (!appConfig.jwtSecret) return false;
            jwt.verify(token, appConfig.jwtSecret);
            return true;
        }
        catch {
            return false;
        }
    }

    // Verify admin:
    public verifyAdmin(token: string): boolean {
        try {
            if (!token) return false;
            if (!appConfig.jwtSecret) return false;
            jwt.verify(token, appConfig.jwtSecret);
            const payload = jwt.decode(token) as { user: UserModel };
            const user = payload.user;
            return user.role === Role.Admin;
        }
        catch {
            return false;
        }
    }

    // Get user id from token: 
    public getTokenUserId(token: string): number {
        try {
            const payload = jwt.decode(token) as { user: UserModel };
            const user = payload.user;
            return Number(user.userId);
        }
        catch {
            return 0;
        }
    }

}

export const cyber = new Cyber();
