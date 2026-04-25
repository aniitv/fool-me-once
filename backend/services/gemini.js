import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function interpretGemini(card, { signal }) {
  const promt = `You are a tarot card interpreter. Interpret the following card in 2-3 sentences: ${card.name}, reversed: ${card.reversed}`;
  const result = await model.generateContent(promt, { signal });
  return result.response.text();
}
