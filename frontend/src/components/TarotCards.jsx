import { useState, useEffect } from "react";
import Saved from "./Saved.jsx";
import { Shuffle, flipSequence } from "../../../backend/logic.js";
import { useNavigate } from "react-router-dom";
import Background from "./Background.jsx";

import "../styles/cards.css";

export default function TarotCards() {
  const [Deck, setDeck] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [showRevealButton, setShowRevealButton] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeck = async () => {
      const response = await fetch("http://localhost:5000/api/cards/stream");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop();

        for (const line of lines) {
          if (line.trim()) {
            const card = JSON.parse(line);
            setDeck((prev) =>
              prev.some((c) => c.id === card.id) ? prev : [...prev, card],
            );
          }
        }
      }
    };

    fetchDeck();
  }, []);

  const handleSaveImages = async () => {
    if (selectedCards.length < 3) return;

    try {
      await fetch("http://localhost:5000/api/saved/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: selectedCards.map((c) => c.image),
          priority: selectedCards.filter((c) => c.isReversed).length + 1,
        }),
      });
      alert("cards were saved");
    } catch (error) {
      console.error("error when saving cards", error);
    }
  };

  const handleShuffle = async () => {
    if (isShuffling) return;
    setShowRevealButton(true);
    setHasShuffled(false);
    setSelectedCards([]);
    setFlippedCards([]);

    setIsShuffling(true);

    const shuffleGenerator = Shuffle(Deck);

    const shuffleInterval = setInterval(() => {
      const { value, done } = shuffleGenerator.next();

      if (done) {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
        setHasShuffled(true);
      } else {
        setDeck(value);
      }
    }, 60);

    try {
      await fetch("http://localhost:5000/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Deck shuffled",
          type: "info",
          priority: 2,
        }),
      });
    } catch (error) {
      console.error("Error occurred while fetching notifications:", error);
    }
  };

  const handleSelectCard = (card) => {
    if (!hasShuffled) return;
    if (selectedCards.length === 3) return;
    const alreadySelected = selectedCards.some((c) => c.id === card.id);
    if (alreadySelected) return;

    const isReversed = Math.random() < 0.5;
    setSelectedCards((prev) => [...prev, { ...card, isReversed }]);
  };

  const iterateTimeout = (iterator, timeout, onValue) => {
    const deadline = Date.now() + timeout * 1000;

    function process() {
      if (Date.now() >= deadline) return;
      const result = iterator.next();
      if (!result.done) {
        onValue(result.value);
        setTimeout(process, 800);
      }
    }
    process();
  };

  const startFlip = async () => {
    setShowRevealButton(false);
    const generator = flipSequence(selectedCards);

    iterateTimeout(generator, 5, (card) => {
      setFlippedCards((prev) => [...prev, card.id]);
    });

    try {
      await fetch("http://localhost:5000/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Cards revealed",
          type: "success",
          priority: 2,
        }),
      });
    } catch (error) {
      console.error("Error occurred while fetching notifications:", error);
    }
  };

  return (
    <div className="tarot-container">
      <Background />

      <div className="controls">
        <button
          className="shuffle-button"
          onClick={handleShuffle}
          disabled={isShuffling || Deck.length === 0}
        >
          Shuffle
        </button>

        {selectedCards.length === 3 && showRevealButton && (
          <button className="reveal-button" onClick={startFlip}>
            Reveal Cards
          </button>
        )}

        <div className="button-row">
          {flippedCards.length === 3 && (
            <button className="save-button" onClick={handleSaveImages}>
              Save cards
            </button>
          )}

          {flippedCards.length === 3 && (
            <button
              className="result-button"
              onClick={() =>
                navigate("/result", { state: { cards: selectedCards } })
              }
            >
              View Result
            </button>
          )}

          <button
            className="archive-toggle-button"
            onClick={() => setIsArchiveOpen(true)}
          >
            View savings
          </button>
        </div>
      </div>

      <div className="deck">
        {Deck.map((card) => {
          const isSelected = selectedCards.some((c) => c.id === card.id);
          const isFlipped = flippedCards.includes(card.id);

          return (
            <div
              key={card.id}
              className={`card-container ${isSelected ? "selected" : ""} ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleSelectCard(card)}
            >
              <div className="card-body">
                <div className="card-back">
                  <img
                    src="/cards/Back.jpg"
                    className="card-image"
                    alt="back"
                  />
                </div>
                <div className="card-front">
                  <img src={card.image} className="card-image" alt="front" />
                  <div className="card-label">{card.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isArchiveOpen && (
        <div className="modal-overlay">
          <Saved onClose={() => setIsArchiveOpen(false)} />
        </div>
      )}
    </div>
  );
}
