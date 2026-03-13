import { CardList } from "../../frontend/src/data/Cards";

function interpretCard(cardName, isReversed) {
  const card = CardList.find((c) => c.name === cardName);
  if (card) {
    return isReversed ? card.reversed : card.meaning;
  } else {
    return "Card not found";
  }
}
