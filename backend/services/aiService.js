async function fetchAi(cards) {
  const response = await fetch("AIzaSyAKFVyqzmRLqZS6ykJnqgShLM_mDVKForw", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cards }),
  });
  return response.json();
}

export default fetchAi;
