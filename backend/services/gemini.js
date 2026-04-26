import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function interpretGemini(card, { signal } = {}) {
  const prompt = `You are a tarot card interpreter. Interpret the following card in 2-3 sentences: ${card.name}, reversed: ${card.reversed}`;
  const result = await model.generateContent(prompt);
  return {
    card: card.name,
    text: result.response.text(),
  };
}
