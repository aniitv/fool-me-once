export function memoize(fn, options = {}) {
  const limit = options.limit || Infinity;
  const policy = options.policy || "LRU";
  const ttl = options.ttl || 60000;

  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);
    const now = Date.now();

    if (cache.has(key)) {
      const data = cache.get(key);

      if (policy === "Time" && now - data.createdAt > ttl) {
        cache.delete(key);
      } else {
        data.usageCount++;
        data.lastUsed = now;
        return data.result;
      }
    }

    const result = fn(...args);

    if (cache.size >= limit) {
      let keyToRemove = null;

      if (policy === "LRU") {
        let oldestTime = Infinity;
        for (let [itemKey, itemData] of cache.entries()) {
          if (itemData.lastUsed < oldestTime) {
            oldestTime = itemData.lastUsed;
            keyToRemove = itemKey;
          }
        }
      } else if (policy === "LFU") {
        let smallestUsage = Infinity;
        for (let [itemKey, itemData] of cache.entries()) {
          if (itemData.usageCount < smallestUsage) {
            smallestUsage = itemData.usageCount;
            keyToRemove = itemKey;
          }
        }
      } else {
        keyToRemove = cache.keys().next().value;
      }

      if (keyToRemove) cache.delete(keyToRemove);
    }

    cache.set(key, {
      result: result,
      createdAt: now,
      lastUsedAt: now,
      usageCount: 1,
    });

    return result;
  };
}
