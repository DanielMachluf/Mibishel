import { appConfig } from "../2-utils/app-config";
import { parseN8nResponse } from "../2-utils/n8n-parser";
import { AskAiModel } from "../3-models/ai-model";

/**
 * What we expect n8n's "Respond to Webhook" node to return.
 *
 * n8n's "Message a model" node exposes the reply under the key `text`.
 * After parseN8nResponse() unwraps the array / { json:… } envelope we get:
 *   { text: "Yes, you can replace eggs with..." }
 *
 * WHY keep this interface here and not in the model?
 * N8nAiResponse describes n8n's wire format — it is an HTTP transport detail,
 * not a domain concept. It never leaves this file, so it belongs here.
 */
interface N8nAiResponse {
    text?:   string;
    answer?: string;
    output?: string;
}

class AiService {

    /**
     * Sends the validated question + recipe context to n8n and returns the
     * AI's answer as a plain string.
     *
     * Flow:
     *  1. Confirm the webhook URL is configured (fail fast if missing).
     *  2. POST { question, recipe } to N8N_ASK_AI_WEBHOOK_URL.
     *  3. parseN8nResponse() normalises all envelope/array shapes n8n produces.
     *  4. Extract the answer string and return it to the controller.
     *
     * Validation is NOT done here — the controller constructs AskAiModel and
     * calls model.validate() before reaching this method.
     */
    public async askAboutRecipe(model: AskAiModel): Promise<string> {
        if (!appConfig.n8nAskAiWebhookUrl) {
            throw new Error("Missing N8N_ASK_AI_WEBHOOK_URL configuration.");
        }

        const response = await fetch(appConfig.n8nAskAiWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: model.question.trim(), recipe: model.recipe })
        });

        if (!response.ok) {
            throw new Error(`n8n AI webhook returned HTTP ${response.status}.`);
        }

        const raw = await response.text();

        // parseN8nResponse handles: junk prefix, plain object, array, and
        // the { json: { … } } envelope that n8n produces by default.
        const parsed = parseN8nResponse<N8nAiResponse>(raw);

        // Accept whichever key the n8n workflow uses for its text output.
        const answer = parsed.text ?? parsed.answer ?? parsed.output;

        if (!answer || typeof answer !== "string") {
            throw new Error("AI response from n8n did not contain a readable answer.");
        }

        return answer;
    }
}

export const aiService = new AiService();

