const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

let currentLevel = LOG_LEVELS.DEBUG;

export function setLogLevel(level) {
  if (LOG_LEVELS[level] === undefined) {
    throw new Error(`Unknown log level: ${level}`);
  }
  currentLevel = LOG_LEVELS[level];
}

function log(level, message, data) {
  if (LOG_LEVELS[level] < currentLevel) return;

  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] [${level}] ${message}`);
  if (data !== undefined) console.dir(data);
}

export function withLogging(fn, level = "INFO") {
  return function (...args) {
    log(level, `Calling "${fn.name}" with args:`, args);

    try {
      const result = fn.apply(this, args);
      log(level, `"${fn.name}" returned:`, result);
      return result;
    } catch (err) {
      log("ERROR", `"${fn.name}" threw an error: ${err.message}`);
      throw err;
    }
  };
}
