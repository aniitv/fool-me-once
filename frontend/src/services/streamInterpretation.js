export async function* streamInterpretation(cards) {
  let data;

  try {
    const response = await fetch("http://localhost:5000/api/ai/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cards }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch AI interpretation");
    }

    data = await response.json();
  } catch (error) {
    console.warn("STREAM FALLBACK ACTIVATED:", error.message);

    data = {
      interpretations: cards.map((c) => ({
        card: c.name,
        text: `${c.meaning}. In reverse: ${c.reversed}.`,
      })),
    };
  }

  const results = data?.interpretations || [];

  for (const item of results) {
    const text = item?.text || "";
    if (!text) continue;

    const words = text.split(" ");
    let partial = "";

    for (const word of words) {
      partial += word + " ";

      yield {
        card: item.card || "Unknown card",
        text: partial.trim(),
      };
      await new Promise((r) => setTimeout(r, 40));
    }
  }
}
