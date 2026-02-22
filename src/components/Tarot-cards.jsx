import { useState } from "react";
import { CardList } from "../data/Cards";
import "../styles/cards.css";

export default function TarotCards() {
  const [Deck, setDeck] = useState(CardList);
  const [isShuffling, setIsShuffling] = useState(false);

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

  return (
    <div className="tarot-container">
      <button
        className="shuffle-button"
        onClick={handleShuffle}
        disabled={isShuffling}
      >
        Shuffle
      </button>
      <div className="deck">
        {Deck.map((card) => (
          <div key={card.id} className="card">
            <img src={card.image} alt={card.name} className="card-image" />
          </div>
        ))}
      </div>
    </div>
  );
}
