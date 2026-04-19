import { memoizedCard } from "../utils/memoization.js";
import fetchAi from "./aiService.js";

export const memoizedAi = memoizedCard(fetchAi, {
  maxSize: 50,
});
