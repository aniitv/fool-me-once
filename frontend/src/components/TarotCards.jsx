import { useState } from "react";
import { CardList } from "../data/Cards.jsx";
import {
  Shuffle,
  flipSequence,
} from "../../../backend/logic.js";
import Background from "./Background.jsx";

import "../styles/cards.css";

export default function TarotCards() {

  const [Deck, setDeck] = useState(CardList);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  // const ShuffleSound = new Audio("/assets/sounds/shuffle.mp3");
  // const FlipSound = new Audio("/assets/sounds/flip.wav");

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
    if (!hasShuffled) return; //prevent selection if cards haven't been shuffled yet

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
                  <img src="/cards/Back.jpg" className="card-image" />
                </div>

                <div className="card-front">
                  <img src={card.image} className="card-image" />
                  <div className="card-label">{card.name}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
