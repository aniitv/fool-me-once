export async function interpretCard(cards, { signal } = {}) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/api/ai/interpret`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cards }),
      signal,
    },
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || "Failed to fetch AI interpretation");
  }

  return response.json();
}
