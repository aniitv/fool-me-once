import { memoizedCard } from "../utils/memoization.js";
import { interpretCard } from "./aiService.js";

export const memoizedAi = memoizedCard(interpretCard, {
  maxSize: 50,
});
