import { authProxy } from "../proxy/authProxy.js";

export async function interpretGeminiBatch(cards) {
  const timePositions = ["Past", "Present", "Future"];
  const prompt = `
You must interpret each card according to:
- its TIME position
- whether it is upright or reversed
- BOTH upright and reversed meanings

Spread rules:
- First card = Past
- Second card = Present
- Third card = Future

Instructions:
- Write emotionally and mystically
- 3-5 sentences per card
- Explain how the card affects the person's timeline
- If the card is reversed, interpretation must feel blocked, distorted, delayed or shadowed
- If upright, interpretation should feel natural and flowing

Return ONLY valid JSON:

[
  {
    "card": "The Fool",
    "text": "..."
  }
]

Cards:
${cards
  .map(
    (c, index) => `
Card: ${c.name}
Time Position: ${timePositions[index]}
Upright: ${c.meaning}
Reversed: ${c.reversed}
Observed: ${c.isReversed ? "Reversed" : "Upright"}
`,
  )
  .join("\n")}
`;

  try {
    const data = await authProxy(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
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

    const parsed = JSON.parse(cleanJson);

    const safeArray = Array.isArray(parsed) ? parsed : [];

    return safeArray.map((x, i) => ({
      card: x?.card || cards[i]?.name,

      text:
        x?.text ||
        `
Upright Meaning:
${cards[i]?.meaning}

Reversed Meaning:
${cards[i]?.reversed}
        `.trim(),
    }));
  } catch (error) {
    console.warn("FALLBACK ACTIVATED:", error.message);

    return cards.map((c) => ({
      card: c.name,

      text: `
Upright Meaning:
${c.meaning}

Reversed Meaning:
${c.reversed}
      `.trim(),
    }));
  }
}
