/**
 * Structured Logger for ggtickets bot
 */

const getTimestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

const logger = {
  info: (msg, ...args) => {
    console.log(`\x1b[36m[${getTimestamp()}] [INFO]\x1b[0m ${msg}`, ...args);
  },
  success: (msg, ...args) => {
    console.log(`\x1b[32m[${getTimestamp()}] [SUCCESS]\x1b[0m ${msg}`, ...args);
  },
  warn: (msg, ...args) => {
    console.warn(`\x1b[33m[${getTimestamp()}] [WARN]\x1b[0m ${msg}`, ...args);
  },
  error: (msg, ...args) => {
    console.error(`\x1b[31m[${getTimestamp()}] [ERROR]\x1b[0m ${msg}`, ...args);
  },
  debug: (msg, ...args) => {
    if (process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development') {
      console.log(`\x1b[90m[${getTimestamp()}] [DEBUG]\x1b[0m ${msg}`, ...args);
    }
  }
};

module.exports = logger;
