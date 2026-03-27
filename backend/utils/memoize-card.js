export function memoizeCard(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);

    if (cache.size >= 100) {
      cache.clear();
    }
    cache.set(key, result);
    return result;
  };
}
