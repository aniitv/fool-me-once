import { authProxy } from "../proxy/authProxy.js";
import { ApiKeyStrategy } from "../proxy/strategies/apiKeyStrategy.js";

const strategy = new ApiKeyStrategy(process.env.GEMINI_API_KEY);

export async function interpretGemini(card, { signal } = {}) {
  const prompt = `You are a tarot card interpreter. Interpret the following card in 2-3 sentences: ${card.name}, reversed: ${card.reversed}`;
  const data = await authProxy(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    },
    strategy,
  );
  return {
    card: card.name,
    text:
      data?.candidates?.[0]?.content?.parts[0]?.text ||
      "No interpretation available",
  };
}
