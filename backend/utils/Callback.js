export function Callback(arr, fn, cb, { signal } = {}) {
  let result = [];
  let completed = 0;
  let finished = false;

  if (signal?.aborted) {
    return cb(new Error("Aborted"));
  }

  const onAbort = () => {
    if (finished) return;
    finished = true;
    cleanup();
    cb(new Error("Aborted"));
  };

  function cleanup() {
    signal?.removeEventListener("abort", onAbort);
  }

  signal?.addEventListener("abort", onAbort);

  arr.forEach((item, index) => {
    fn(item, (err, res) => {
      if (finished) return;
      if (err) {
        finished = true;
        cleanup();
        return cb(err);
      }

      result[index] = res;
      completed++;

      if (completed === arr.length) {
        finished = true;
        cleanup();
        cb(null, result);
      }
    });
  });
}
