export async function interpretCard(cards, { signal } = {}) {
  const response = await fetch("http://localhost:5000/api/ai/interpret", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cards }),
    signal,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch AI interpretation");
  }
  return await response.json();
}
