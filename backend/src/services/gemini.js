import { authProxy } from "../proxy/authProxy.js";

export async function interpretGeminiBatch(cards) {
  const prompt = `
  You are a tarot interpreter.

  For EACH card:
  - Use BOTH upright and reversed meanings
  - Combine them into a single interpretation
  - Write ONLY 2-3 short sentences

  Return JSON array:
  [
    {
      "card": "The Fool",
      "text": "..."
    }
  ]

  Cards:
  ${cards
    .map(
      (c) => `
  ${c.name}
  Upright: ${c.meaning}
  Reversed: ${c.reversed}
  `,
    )
    .join("\n")}
  `;

  try {
    const data = await authProxy(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;

    return JSON.parse(cleanJson);
  } catch (error) {
    console.warn("FALLBACK ACTIVATED:", error.message);

    return cards.map((c) => ({
      card: c.name,
      text: c.reversed ? c.reversedMeaning : c.meaning,
    }));
  }
}
