import { useLocation, useNavigate } from "react-router-dom";
import Card from "./Card";
import Background from "./Background";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const cards = location.state?.cards;

  if (!cards) {
    return (
      <div>
        <h2>Немає даних</h2>
        <button onClick={() => navigate("/")}>Назад</button>
      </div>
    );
  }

  return (
    <div className= "result-container">
      <Background />
      <h1>Результат розкладу</h1>

      <div className = "result-cards">
        {cards.map((card, index) => (
          <Card
            key={index}
            card={card}
            isReversed={card.reversed}
          />
        ))}
      </div>

      <button onClick={() => navigate("/")}>
        Новий розклад
      </button>
    </div>
  );
}