import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages, language = "English", apiKey } = await req.json();

  // Use API key from request body or fallback to environment variable
  const sutraApiKey = apiKey || process.env.SUTRA_API_KEY;

  if (!sutraApiKey) {
    return new Response(
      JSON.stringify({
        error: "API key not found. Please provide a SUTRA API key in settings.",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const openai = createOpenAI({
    apiKey: sutraApiKey,
    baseURL: "https://api.two.ai/v2",
  });

  // Create a language-specific system prompt
  let systemPrompt = "";

  if (language === "English") {
    systemPrompt =
      "You are a helpful multilingual assistant proficient in various Indian languages. Currently, the user has selected English as their preferred language. Please respond in English.";
  } else {
    systemPrompt = `You are a helpful multilingual assistant proficient in various Indian languages. The user has selected ${language} as their preferred language. Please respond primarily in ${language}. If you're not sure about certain terms in ${language}, you can mix in some English, but try to use ${language} as much as possible. Be culturally appropriate and respectful.`;
  }

  const result = streamText({
    model: openai("sutra-v2"),
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ],
  });

  return result.toDataStreamResponse();
}
