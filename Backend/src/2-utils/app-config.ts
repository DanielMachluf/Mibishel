import dotenv from "dotenv";

dotenv.config({ quiet: true });

class AppConfig {
    public readonly isDevelopment = process.env.ENVIRONMENT === "development";
    public readonly isProduction = process.env.ENVIRONMENT === "production";
    public readonly port = Number(process.env.PORT);
    public readonly mysqlHost = process.env.MYSQL_HOST;
    public readonly mysqlUser = process.env.MYSQL_USER;
    public readonly mysqlPassword = process.env.MYSQL_PASSWORD;
    public readonly mysqlDatabase = process.env.MYSQL_DATABASE;
    public readonly hashSalt = (process.env.HASH_SALT);
    public readonly jwtSecret = process.env.JWT_SECRET;
    public readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    // Webhook for the "Ask AI about a recipe" n8n automation.
    public readonly n8nAskAiWebhookUrl = process.env.N8N_ASK_AI_WEBHOOK_URL;
}

export const appConfig = new AppConfig();
