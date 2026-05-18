import { useState, useEffect } from "react";
import "../styles/cards.css";

export default function Saved({ onClose }) {
  const [savedReadings, setSavedReadings] = useState([]);

  const fetchSavedReadings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/saved/all");
      const data = await response.json();
      setSavedReadings(data);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  };

  useEffect(() => {
    fetchSavedReadings();
  }, []);

  return (
    <div className="saved-archive">
      {onClose && (
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      )}
      <h2>Your tarot archive</h2>
      <div className="archive-grid">
        {savedReadings.length === 0 ? (
          <p>No saved readings yet</p>
        ) : (
          savedReadings.map((reading, index) => (
            <div key={index} className="archive-item">
              <span>Priority: {reading.priority}</span>
              <div className="archive-cards">
                {reading.item?.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="archive-card-mini"
                    alt="tarot"
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
