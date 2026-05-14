// Promise-based async filter
export function asyncFilterPromise(array, asyncPredicate) {
  return Promise.all(array.map((item) => asyncPredicate(item))).then(
    (results) => array.filter((_, i) => results[i]),
  );
}
