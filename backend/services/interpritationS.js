import { CardList } from "../../frontend/src/data/Cards";
import { memoizeCard } from "..utils/memoize-card";

function interpretCard(cardName, isReversed) {
  console.log("Cache");

  const card = CardList.find((c) => c.name === cardName);
  if (card) {
    return isReversed ? card.reversed : card.meaning;
  } else {
    return "Card not found";
  }
}

export const memoizedInterpretCard = memoizeCard(interpretCard);
