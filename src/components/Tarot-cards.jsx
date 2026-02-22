import { useEffect, useState } from "react";
import { CardList } from "../data/Cards";
import "../styles/cards.css";
import "../styles/stars.css";

export default function TarotCards() {
  const [star, setStar] = useState([]);
  useEffect(() => {
    createStars(setStar);
  }, []);

  const [Deck, setDeck] = useState(CardList);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  // const ShuffleSound = new Audio("/assets/sounds/shuffle.mp3");
  // const FlipSound = new Audio("/assets/sounds/flip.wav");

  // Stars on background
  function* starGenerator () {
    while (true) {
      yield {
        id: Math.random().toString(36).substr(2),
        left: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        size: 10 + Math.random() * 5,
      }
    }
  }
  // Iterator
  function createStars( setStar, intervalMs = 100 ) {
    const generator = starGenerator();
    setInterval(() => {
      const { value } = generator.next();
      setStar((prev) => [...prev, value]);
    }, intervalMs);
  }
    
    // ГЕНЕРАТОР
  function* Shuffle(cards) {
    const shuffled = [...cards];
    // супер класне перемішування Фішера-Йетса
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      // yield кожного разу після перемішування, щоб оновити стан колоди
      yield [...shuffled];
    }
  }

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
      <div className= "star-container">
        {star.map((star) => (
          <span 
            key={star.id}
            className="star"
            style={{
              left: `${star.left}%`,
              fontSize: `${star.size}px`,
              animationDuration: `${star.duration}s`,
            }}
          >✦</span>
        ))}
      </div>
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
