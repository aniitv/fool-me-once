<<<<<<< HEAD:backend/services/interpretationS.js
import { CardList } from "../../frontend/src/data/Cards";
import { memoizeCard } from "../utils/memoize-card";
import { notificationS } from "./notificationS";
=======
import { CardList } from "../src/data/Cards.js";
import { memoizeCard } from "../utils/memoize-card.js";
>>>>>>> 2594c4b952ddd9160620f04c3aad6606ce4d20ce:backend/services/interpritationS.js

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
