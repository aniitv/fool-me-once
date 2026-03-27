export function memoize(fn, limit = 10) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const data = cache.get(key);
      data.lastUsed = now;
      return data.result;
    }

    const result = fn(...args);

    if (cache.size >= limit) {
      let oldestTime = Infinity;
      let keyToRemove = null;

      for (let [itemKey, itemData] of cache.entries()) {
        if (itemData.lastUsed < oldestTime) {
          oldestTime = itemData.lastUsed;
          keyToRemove = itemKey;
        }
      }

      if (keyToRemove) cache.delete(keyToRemove);
    }

    cache.set(key, {
      result,
      lastUsed: now,
    });

    return result;
  };
}
