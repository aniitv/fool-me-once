import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Card from "./Card";
import Background from "./Background";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cards = location.state?.cards;

  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("http://localhost:5000/api/ai/interpret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({ cards }),
    })
      .then((res) => res.json())
      .then((data) => setResults(data.interpretations))
      .catch((err) => console.log(err));

    return () => controller.abort();
  }, [cards]);

  if (!cards) {
    return (
      <div>
        <h2>Немає даних</h2>
        <button onClick={() => navigate("/")}>Назад</button>
      </div>
    );
  }

  return (
    <div className="result-container">
      <Background />
      <h1>AI Результат</h1>

      <div className="result-cards">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            interpretation={results[index]?.text || "Loading..."}
          />
        ))}
      </div>

      <button onClick={() => navigate("/")}>
        Новий розклад
      </button>
    </div>
  );
}