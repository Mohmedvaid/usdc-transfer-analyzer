// src/config/logger.js
const winston = require("winston");
const { env } = require("../config/app.config");

/**
 * A logger for logging errors.
 */
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

if (env !== "PRODUCTION") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
