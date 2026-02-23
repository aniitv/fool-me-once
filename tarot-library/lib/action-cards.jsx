function shuffleDeck(deck) {
  const shuffled = [...deck];
  let i = shuffled.length - 1;
  while (i > 0) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    i--;
  }
  return shuffled;
}

function selectCards(selectedCards, card) {
  if (selectedCards.length >= 3) return selectedCards;
  return [...selectedCards, card];
}

function* flipSequence(cards) {
  for (let i = 0; i < cards.length; i++) {
    yield cards[i];
  }
}

function iterateTimeout(iterator, timeoutSeconds, onValue) {
  const deadline = Date.now() + timeoutSeconds * 1000;

  function process() {
    if (Date.now() >= deadline) return;
    const result = iterator.next();
    if (!result.done) {
      onValue(result.value);
      setTimeout(process, 800);
    }
  }

  process();
}

module.exports = {
  shuffleDeck,
  selectCards,
  flipSequence,
  iterateTimeout
};