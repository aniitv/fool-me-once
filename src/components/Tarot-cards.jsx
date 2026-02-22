import { useState } from "react";
import { CardList } from "../data/Cards";
import "../styles/cards.css";

export default function TarotCards() {
  const [Deck, setDeck] = useState(CardList);
  const [isShuffling, setIsShuffling] = useState(false);
  const [hasShuffled, setHasShuffled] = useState(false);

  const [selectedCards, setSelectedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);

  // const ShuffleSound = new Audio("/assets/sounds/shuffle.mp3");
  // const FlipSound = new Audio("/assets/sounds/flip.wav");

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
    if (selectedCards.length === 3) return;

    setSelectedCards((prev) => [...prev, card]); //prev - array of already selected cards + new selected card
  };

  function* flipSequence(cards) {
    for (let i = 0; i < cards.length; i++) {
      yield i;
    }
  }
  //iterator for sequential flipping choosen cards
  const startFlipSequence = () => {
    const generator = flipSequence(selectedCards);

    function flipNext() {
      const result = generator.next();
      const value = result.value; // value = 0
      const done = result.done; //done=false
      if (!done) {
        // flipSoundRef.currentTime = 0;
        // flipSoundRef.play();

        //adding revealed cards to an array
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
