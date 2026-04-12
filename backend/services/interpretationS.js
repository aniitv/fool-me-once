import { CardList } from "../src/data/Cards.js";
import { memoizeCard } from "../utils/memoize-card.js";
import { notificationS } from "./notificationS.js";

function interpretCard(cardName, isReversed) {
  const card = CardList.find((c) => c.name === cardName);
  if (card) {
    const result = isReversed ? card.reversed : card.meaning;

    notificationS.add(`Interpreted card: ${cardName}`, "success", 5);
    return result;
  } else {
    notificationS.add(`Card not found: ${cardName}`, "error", 10);
    return "Card not found";
  }
}

export const memoizedInterpretCard = memoizeCard(interpretCard, {
  maxSize: 100,
});
