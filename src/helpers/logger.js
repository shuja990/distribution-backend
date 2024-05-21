const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const SequelizeTransport = require('./SequelizeTransport'); // Ensure this path is correct based on your project structure

// Custom format for console output with colors
const consoleFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  if (level === 'error') {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  } else {
    const { statusCode, url } = metadata;
    return `${timestamp} [${level.toUpperCase()}]: ${message} (Status Code: ${statusCode}, URL: ${url})`;
  }
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/api-calls-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d'
    }),
    new DailyRotateFile({
      filename: 'logs/errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d'
    }),
    new SequelizeTransport()
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d'
    }),
    new SequelizeTransport()
  ]
});

// Add colored console transport
logger.add(new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    consoleFormat
  )
}));

module.exports = logger;
