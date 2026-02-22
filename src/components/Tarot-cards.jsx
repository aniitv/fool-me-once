import { useState } from "react";
import { CardList } from "../data/Cards";
import "../styles/cards.css";

export default function TarotCards() {
  const [Deck, setDeck] = useState(CardList);
  const [isShuffling, setIsShuffling] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  const ShuffleSound = new Audio("/assets/sounds/shuffle.mp3");
  // const FlipSound = new Audio("/assets/sounds/flip.wav");

  function* Shuffle(cards) {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      yield [...shuffled];
    }
  }

  const handleShuffle = () => {
    if (isShuffling) return;

    setIsShuffling(true);
    ShuffleSound.currentTime = 0;
    ShuffleSound.play();

    const shuffleGenerator = Shuffle(Deck);

    const shuffleInterval = setInterval(() => {
      const next = shuffleGenerator.next();
      if (!next.done) {
        setDeck(next.value);
      } else {
        clearInterval(shuffleInterval);
        setIsShuffling(false);
      }
    }, 60);
  };

  const handleSelectCard = (card) => {
    if (selectedCards.length >= 3) return;

    setSelectedCards((prev) => [...prev, card]);
  };

  function* flipSequence(cards) {
    for (let i = 0; i < cards.length; i++) {
      yield i;
    }
  }

  const startFlipSequence = () => {
    const generator = flipSequence(selectedCards);

    function flipNext() {
      const { value, done } = generator.next();

      if (!done) {
        // flipSoundRef.currentTime = 0;
        // flipSoundRef.play();

        setFlippedCards((prev) => [...prev, value]);

        setTimeout(flipNext, 800);
      }
    }

    flipNext();
  };

  return (
    <div className="tarot-container">
      <button
        className="shuffle-button"
        onClick={handleShuffle}
        disabled={isShuffling}
      >
        Shuffle
      </button>

      {selectedCards.length === 3 && (
        <button className="reveal-button" onClick={startFlipSequence}>
          Reveal Cards
        </button>
      )}

      <div className="deck">
        {Deck.map((card) => {
          const isSelected = selectedCards.includes(card);
          const flipIndex = selectedCards.indexOf(card);
          const isFlipped = flippedCards.includes(flipIndex);

          return (
            <div
              key={card.id}
              className={`card-container ${isSelected ? "selected" : ""} ${isFlipped ? "flipped" : ""}`}
              onClick={() => handleSelectCard(card)}
            >
              <div className="card-inner">
                <div className="card-back">
                  <img
                    src="/cards/Back.jpg"
                    alt="Tarot Card Back"
                    className="card-image"
                  />
                </div>

                <div className="card-front">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="card-image"
                  />
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
