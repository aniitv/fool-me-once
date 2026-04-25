export function Promise(arr, fn, { signal } = {}) {
  return new Promise((resolve, reject) => {
    let result = [];
    let completed = 0;
    let finished = false;

    if (signal?.aborted) {
      return reject(new Error("Aborted"));
    }

    const onAbort = () => {
      if (finished) return;
      finished = true;
      cleanup();
      reject(new Error("Aborted"));
    };

    function cleanup() {
      signal?.removeEventListener("abort", onAbort);
    }

    signal?.addEventListener("abort", onAbort);

    arr.forEach((item, index) => {
      fn(item, { signal })
        .then((value) => {
          if (finished) return;
          result[index] = value;
          completed++;

          if (completed === arr.length) {
            finished = true;
            cleanup();
            resolve(result);
          }
        })
        .catch((err) => {
          if (finished) return;
          finished = true;
          cleanup();
          reject(err);
        });
    });
  });
}
