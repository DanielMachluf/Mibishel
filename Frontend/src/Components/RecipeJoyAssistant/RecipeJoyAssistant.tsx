import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import type { RecipeContext } from "../../Models/ai-model";
import type { RecipeModel } from "../../Models/recipe-model";
import { aiService } from "../../Services/AiService";
import { notify } from "../../Utils/Notify";
import "./RecipeJoyAssistant.css";

interface RecipeJoyAssistantProps {
    recipe: RecipeModel;
}

interface ChatMessage {
    id: number;
    role: "user" | "assistant";
    text: string;
    displayText: string;
    isTyping?: boolean;
    isPending?: boolean;
}

const suggestions = [
    "How can I make this healthier?",
    "What can I substitute?",
    "Can I meal prep this?",
    "How do I scale servings?"
];

export function RecipeJoyAssistant({ recipe }: RecipeJoyAssistantProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [question, setQuestion] = useState("");
    const [isAsking, setIsAsking] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 1,
            role: "assistant",
            text: `Hi, I’m Joy. Ask me anything about ${recipe.title}.`,
            displayText: `Hi, I’m Joy. Ask me anything about ${recipe.title}.`
        }
    ]);
    const messageIdRef = useRef(2);
    const timersRef = useRef<number[]>([]);
    const endRef = useRef<HTMLDivElement>(null);
    const questionFieldRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        return () => {
            timersRef.current.forEach(timer => window.clearInterval(timer));
        };
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages, isOpen]);

    useEffect(() => {
        const questionField = questionFieldRef.current;
        if (!questionField) return;

        questionField.style.height = "auto";
        questionField.style.height = `${Math.min(questionField.scrollHeight, 160)}px`;
        questionField.style.overflowY = questionField.scrollHeight > 160 ? "auto" : "hidden";
    }, [question, isOpen]);

    async function submitQuestion(event?: FormEvent<HTMLFormElement>, overrideQuestion?: string): Promise<void> {
        event?.preventDefault();
        const trimmedQuestion = (overrideQuestion ?? question).trim();
        if (!trimmedQuestion || isAsking) return;

        const userMessageId = messageIdRef.current++;
        const assistantMessageId = messageIdRef.current++;
        setQuestion("");
        setIsAsking(true);
        setMessages(currentMessages => [
            ...currentMessages,
            {
                id: userMessageId,
                role: "user",
                text: trimmedQuestion,
                displayText: trimmedQuestion
            },
            {
                id: assistantMessageId,
                role: "assistant",
                text: "",
                displayText: "",
                isPending: true
            }
        ]);

        try {
            const answer = await aiService.askAboutRecipe({
                question: trimmedQuestion,
                recipe: toRecipeContext(recipe)
            });

            setMessages(currentMessages => currentMessages.map(message => (
                message.id === assistantMessageId
                    ? { ...message, text: answer, displayText: "", isPending: false, isTyping: true }
                    : message
            )));
            animateAnswer(assistantMessageId, answer);
        }
        catch (err: unknown) {
            setMessages(currentMessages => currentMessages.filter(message => message.id !== assistantMessageId));
            notify.error(err);
        }
        finally {
            setIsAsking(false);
        }
    }

    function animateAnswer(messageId: number, answer: string): void {
        const words = answer.split(/(\s+)/).filter(Boolean);
        let index = 0;

        const timer = window.setInterval(() => {
            index += 1;
            setMessages(currentMessages => currentMessages.map(message => (
                message.id === messageId
                    ? {
                        ...message,
                        displayText: words.slice(0, index).join(""),
                        isTyping: index < words.length
                    }
                    : message
            )));

            if (index >= words.length) {
                window.clearInterval(timer);
                timersRef.current = timersRef.current.filter(savedTimer => savedTimer !== timer);
            }
        }, 28);

        timersRef.current.push(timer);
    }

    function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void submitQuestion();
        }
    }

    return (
        <>
            <button
                className="RecipeJoyAssistant__launcher"
                onClick={() => setIsOpen(true)}
                aria-label="Ask Joy about this recipe"
            >
                <span>Joy</span>
            </button>

            {isOpen && (
                <div className="RecipeJoyAssistant" role="dialog" aria-label="Ask Joy about this recipe">
                    <div className="RecipeJoyAssistant__panel">
                        <header className="RecipeJoyAssistant__header">
                            <div className="RecipeJoyAssistant__identity">
                                <span>J</span>
                                <div>
                                    <strong>Joy</strong>
                                    <small>Recipe assistant</small>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} aria-label="Close Joy assistant">×</button>
                        </header>

                        <div className="RecipeJoyAssistant__messages">
                            {messages.map(message => (
                                <article
                                    className={`RecipeJoyAssistant__message RecipeJoyAssistant__message--${message.role}`}
                                    key={message.id}
                                >
                                    {message.isPending ? (
                                        <span className="RecipeJoyAssistant__thinking">
                                            <i />
                                            <i />
                                            <i />
                                        </span>
                                    ) : (
                                        <p>{message.displayText}</p>
                                    )}
                                </article>
                            ))}
                            <div ref={endRef} />
                        </div>

                        <div className="RecipeJoyAssistant__suggestions">
                            {suggestions.map(suggestion => (
                                <button
                                    key={suggestion}
                                    onClick={() => submitQuestion(undefined, suggestion)}
                                    disabled={isAsking}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>

                        <form className="RecipeJoyAssistant__form" onSubmit={submitQuestion}>
                            <textarea
                                ref={questionFieldRef}
                                rows={1}
                                value={question}
                                onChange={event => setQuestion(event.target.value)}
                                onKeyDown={handleQuestionKeyDown}
                                placeholder="Ask Joy about swaps, prep, macros..."
                                disabled={isAsking}
                            />
                            <button type="submit" disabled={isAsking || !question.trim()}>Send</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

function toRecipeContext(recipe: RecipeModel): RecipeContext {
    return {
        recipeId: recipe.recipeId,
        title: recipe.title,
        ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : ["Ingredients not available"],
        instructions: recipe.instructions,
        servings: recipe.servings,
        caloriesPerServing: safeNutritionValue(recipe.caloriesPerServing),
        proteinPerServing: safeNutritionValue(recipe.proteinPerServing),
        carbsPerServing: safeNutritionValue(recipe.carbsPerServing),
        fatsPerServing: safeNutritionValue(recipe.fatsPerServing),
        totalCalories: safeNutritionValue(recipe.totalCalories),
        protein: safeNutritionValue(recipe.protein),
        carbs: safeNutritionValue(recipe.carbs),
        fats: safeNutritionValue(recipe.fats)
    };
}

function safeNutritionValue(value: number): number | undefined {
    return value >= 0 && value <= 600 ? value : undefined;
}
