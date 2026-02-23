import { useState } from "react";
import { shuffleDeck, selectCards, flipSequence, iterateTimeout } from "../lib/index";
import { CardList } from "../data/Cards";
import Background from "./Background";
import "../styles/cards.css";

export default function TarotCards() {
  const [Deck, setDeck] = useState(CardList);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  const handleShuffle = () => {
    if (isShuffling) return;
    setHasShuffled(false);
    setSelectedCards([]);
    setFlippedCards([]);
    setIsShuffling(true);

    const shuffleInterval = setInterval(() => {
      setDeck((prevDeck) => {
        const newDeck = shuffleDeck(prevDeck);
        clearInterval(shuffleInterval);
        setIsShuffling(false);
        setHasShuffled(true);
        return newDeck;
      })
    }, 100)
  };

  const handleSelectCard = (card) => {
    if (!hasShuffled) return;
    setSelectedCards((prev) => selectCards(prev, card));
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
