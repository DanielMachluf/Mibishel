import axios from "axios";
import type { AskAiRequest, AskAiResponse } from "../Models/ai-model";
import { appConfig } from "../Utils/AppConfig";
import { createAuthConfig } from "../Utils/AuthConfig";

class AiService {
    public async askAboutRecipe(request: AskAiRequest): Promise<string> {
        const response = await axios.post<AskAiResponse>(
            `${appConfig.apiUrl}/recipes/ask`,
            request,
            createAuthConfig()
        );

        return response.data.answer;
    }
}

export const aiService = new AiService();
