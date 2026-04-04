import { useState } from "react";
import { CardList } from "../../../backend/src/data/Cards.js";
import Saved from "./Saved.jsx";
import { Shuffle, flipSequence } from "../../../backend/logic.js";
import Background from "./Background.jsx";

import "../styles/cards.css";

export default function TarotCards() {
  const [Deck, setDeck] = useState(CardList);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // const [interpretation, setInterpretation] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  // const ShuffleSound = new Audio("/assets/sounds/shuffle.mp3");
  // const FlipSound = new Audio("/assets/sounds/flip.wav");

  const handleSaveImages = async () => {
    if (selectedCards.length < 3) return;

    try {
      await fetch("http://localhost:5000/api/saved/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: selectedCards.map((c) => c.image),
          priority: Math.floor(Math.random() * 5) + 1,
        }),
      });
      alert("cards were saved");
    } catch (error) {
      console.error("error when saving cards", error);
    }
  };

  const handleShuffle = () => {
    // якщо тасується, то не буде тасуватись знов
    if (isShuffling) return;
    // не можна вибрать поки не перетасується
    setHasShuffled(false);
    // вибрані та перевернуті карти скидаються
    setSelectedCards([]);
    setFlippedCards([]);

    setIsShuffling(true);
    // ShuffleSound.currentTime = 0;
    // ShuffleSound.play();

    // виклик ГЕНЕРАТОРА та ІТЕРАТОР
    const shuffleGenerator = Shuffle(Deck);

    const shuffleInterval = setInterval(() => {
      // поточний стан та коли все перемішано
      const { value, done } = shuffleGenerator.next();

      if (done) {
        clearInterval(shuffleInterval);
        // можна тикать кнопочки та карточки
        setIsShuffling(false);
        setHasShuffled(true);
      } else {
        // оновлення колоди
        setDeck(value);
      }
    }, 60);
  };

  const handleSelectCard = (card) => {
    if (!hasShuffled) return;

    if (selectedCards.length === 3) return;

    setSelectedCards((prev) => [...prev, card]);
  };

  const iterateTimeout = (iterator, timeout, onValue) => {
    const deadline = Date.now() + timeout * 1000;

    function process() {
      if (Date.now() >= deadline) {
        return;
      }
      const result = iterator.next();
      const done = result.done;
      if (!done) {
        onValue(result.value);
        setTimeout(process, 800);
      }
    }
    process();
  };

  const startFlip = () => {
    const generator = flipSequence(selectedCards);

    iterateTimeout(generator, 5, (card) => {
      setFlippedCards((prev) => [...prev, card.id]);
    });
  };

  return (
    <div className="tarot-container">
      <Background />

      <div className="controls">
        <button
          className="shuffle-button"
          onClick={handleShuffle}
          disabled={isShuffling}
        >
          Shuffle
        </button>

        {selectedCards.length === 3 && (
          <button className="reveal-button" onClick={startFlip}>
            Reveal Cards
          </button>
        )}

        {flippedCards.length === 3 && (
          <button className="save-button" onClick={handleSaveImages}>
            Save сards
          </button>
        )}

        <button
          className="archive-toggle-button"
          onClick={() => setIsArchiveOpen(true)}
        >
          View saved readings
        </button>
      </div>

      <div className="deck">
        {Deck.map((card) => {
          const isSelected = selectedCards.some((c) => c.id === card.id);
          const isFlipped = flippedCards.includes(card.id);

          return (
            //iterating through deck array and calculating status of each card
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
