import { memoizeCard } from "../utils/memoize-card.js";
import { interpretGemini } from "./gemini.js";

export const memoizedAi = memoizeCard(interpretGemini, {
  maxSize: 50,
});
