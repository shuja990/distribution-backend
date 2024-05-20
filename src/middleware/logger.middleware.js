const logger = require("../helpers/logger");

// Middleware to log all requests
const requestLogger = (req, res, next) => {
  res.on('finish', () => {
    const logInfo = {
      message: `HTTP ${req.method} ${req.url}`,
      timestamp: new Date().toISOString(),
      headers: req.headers,
      body: req.body,
      statusCode: res.statusCode,
      url: req.originalUrl
    };
    if (res.statusCode >= 400) {
      logger.error(logInfo);
    } else {
      logger.info(logInfo);
    }
  });
  next();
};

// Middleware to log errors
const errorLogger = (err, req, res, next) => {
  logger.error({
    message: `Error: ${err.message}`,
    timestamp: new Date().toISOString(),
    stack: err.stack,
    url: req.originalUrl
  });
  next(err);
};

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    message: 'Unhandled Rejection at:',
    reason,
    promise
  });
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error({
    message: 'Uncaught Exception:',
    error
  });
  process.exit(1); // Optional: exit the process after logging the error
});

module.exports = {
  requestLogger,
  errorLogger
};
