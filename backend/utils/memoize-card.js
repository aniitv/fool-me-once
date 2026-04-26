export function memoizeCard(fn, { maxSize = 50 } = {}) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const value = cache.get(key);
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

    if (result instanceof Promise) {
      result.catch(() => cache.delete(key));
    }

    return result;
  };
}
