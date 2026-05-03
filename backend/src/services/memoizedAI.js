import { interpretGeminiBatch } from "./gemini.js";

const cache = new Map();

export const memoizedAi = async (cards) => {
  const key = JSON.stringify(cards);

  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = await interpretGeminiBatch(cards);
  cache.set(key, result);
  return result;
};
