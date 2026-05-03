import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { streamInterpretation } from "../services/streamInterpretation.js";
import Background from "../components/Background";
import "../styles/result.css";

async function sendNotification(message, type = "info", priority = 1) {
  try {
    await fetch("http://localhost:5000/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, type, priority }),
    });
  } catch (error) {
    console.error("Notification error:", error);
  }
}

async function fetchInterpretation(cards, signal) {
  const response = await fetch("http://localhost:5000/api/ai/interpret", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cards }),
    signal,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || "Помилка сервера при отриманні тлумачення");
  }

  return await response.json();
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCards = location.state?.cards;

  const [aiInterpretations, setAiInterpretations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCards || selectedCards.length === 0) {
      navigate("/");
      return;
    }

    let active = true;

    const loadStream = async () => {
      try {
        setLoading(true);

        for await (const chunk of streamInterpretation(selectedCards)) {
          if (!active) break;

          setAiInterpretations(prev => {
            const existing = prev.find(c => c.card === chunk.card);

            if (!existing) return [...prev, chunk];

            return prev.map(c =>
              c.card === chunk.card ? chunk : c
            );
          });
        }

        await sendNotification("Interpretation streamed successfully", "success", 2);

      } catch (err) {
        console.error("Streaming error:", err);
        await sendNotification("Streaming failed", "error", 3);
      } finally {
        setLoading(false);
      }
    };

    loadStream();

    return () => {
      active = false;
    };
  }, [selectedCards, navigate]);

  const interpretationMap = useMemo(() => {
    const map = new Map();
    aiInterpretations.forEach((item) => map.set(item.card, item.text));
    return map;
  }, [aiInterpretations]);

  if (!selectedCards) return null;

  return (
    <div className="result-page-wrapper">
      <Background />

      <div className="result-content">

        <div className="result-cards-row">
          {selectedCards.map((card, index) => {
            const textFromAi = interpretationMap.get(card.name);
            const interpretation = textFromAi;

            return (
              <div key={card.id || index} className="card-column">
                <div className="result-card-container">
                  <img
                    src={card.image}
                    className="result-card-image"
                    alt={card.name}
                    onError={(e) => { e.target.src = "/cards/default.jpg"; }}
                  />
                </div>

                <div className="card-text">
                  <p>
                    {interpretation || (
                      <span className="skeleton-loader">Генерується...</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="result-actions">
          <button className="new-spread-btn" onClick={() => navigate("/")}>
            Новий розклад
          </button>
        </div>

      </div>
    </div>
  );
}