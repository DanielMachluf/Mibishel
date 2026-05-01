import cors from "cors";
import express from "express";
import { appConfig } from "./2-utils/app-config";
import { aiController } from "./5-controllers/ai-controller";
import { recipeController } from "./5-controllers/recipe-controller";
import { userController } from "./5-controllers/user-controller";
import { errorsMiddleware } from "./6-middleware/errors-middleware";

class App {

    public start(): void {
        try {
            const server = express();
            server.use(cors());
            server.use(express.json());
            server.use(userController.router);
            server.use(recipeController.router);
            server.use(aiController.router);
            server.use(errorsMiddleware.routeNotFound);
            server.use(errorsMiddleware.catchAll);
            server.listen(appConfig.port, () => console.log("Listening on http://localhost:" + appConfig.port));
        }
        catch (err: unknown) {
            console.error(err);
        }
    }
}

const app = new App();
app.start();
