import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Background from "./Background";
import { interpretCard } from "../services/interpretCard.js";
import "../styles/result.css";

function Card({ card, interpretation }) {
  return (
    <div className="card-container">
      <div className="card-body">
        <img src={card.image} className="card-image" alt={card.name} />
      </div>
      <h3 className="card-title">{card.name}</h3>
      <p>{interpretation}</p>
    </div>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cards = location.state?.cards;

  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cards || cards.length === 0) {
      navigate("/");
      return;
    }

    const controller = new AbortController();

    interpretCard(cards, { signal: controller.signal })
      .then((data) => {
        setResults(data.interpretations || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [cards]);

  if (!cards) return null;

  return (
    <div className="result-container">
      <Background />

      {error && <p className="error-message">Помилка: {error}</p>}

      <div className="result-cards">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            interpretation={
              loading
                ? "Завантаження..."
                : results[index]?.text || "Немає інтерпретації"
            }
          />
        ))}
      </div>

      <button onClick={() => navigate("/")}>Новий розклад</button>
    </div>
  );
}