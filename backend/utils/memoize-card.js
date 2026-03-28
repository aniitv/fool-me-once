export function memoizeCard(fn, options = {}) {
  const { maxSize = Infinity } = options;
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);

      cache.delete(key);
      cache.set(key, value);

      console.log("From cache");
      return value;
    }

    const result = fn(...args);

    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(key, result);
    return result;
  };
}
