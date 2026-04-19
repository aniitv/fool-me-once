async function fetchAi(cards) {
  const response = await fetch("http://localhost:5000/api/ai/interpret", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cards }),
  });
  return response.json();
}

export default fetchAi;
