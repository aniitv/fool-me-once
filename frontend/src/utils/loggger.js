export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  ERROR: 2,
};

function formatLog({ level, message, data }) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
  };
}

function outputLog(entry) {
  console.log("[LOG]", entry);

  const logs = JSON.parse(localStorage.getItem("logs") || "[]");
  logs.push(entry);
  localStorage.setItem("logs", JSON.stringify(logs));
}

export function log({ level = "INFO", onlyErrors = false } = {}) {
  return function (fn) {
    return async function (...args) {
      const start = performance.now();

      try {
        if (!onlyErrors) {
          outputLog(
            formatLog({
              level,
              message: `CALL ${fn.name}`,
              data: { args },
            }),
          );
        }

        const result = await fn.apply(this, args);

        const end = performance.now();

        if (!onlyErrors) {
          outputLog(
            formatLog({
              level,
              message: `SUCCESS ${fn.name}`,
              data: {
                args,
                result,
                executionTime: `${(end - start).toFixed(2)}ms`,
              },
            }),
          );
        }

        return result;
      } catch (error) {
        outputLog(
          formatLog({
            level: "ERROR",
            message: `ERROR ${fn.name}`,
            data: {
              args,
              error: error.message,
            },
          }),
        );

        throw error;
      }
    };
  };
}
