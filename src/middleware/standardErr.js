//  src/middleware/standardErr.js
const logger = require("../utils/logger");
const CustomError = require("../utils/CustomError");
const { ENV } = require("../config/app.config");

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Express.Request} req - Request object
 * @param {Express.Response} res - Response object
 * @param {Express.NextFunction} next - Next middleware function
 * @returns {Express.Response}
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for server side tracking

  if (err instanceof CustomError) {
    const code = err.statusCode || 500;
    const message = err.message || "An error occurred.";
    return res.standardResponse(
      (statusCode = code),
      (success = false),
      (data = null),
      message,
      (error = true)
    );
  }

  logger.error(err.message);
  logger.error(err.stack);
  if (ENV === "DEVELOPMENT") {
    console.error(err);
  }

  return res.standardResponse(
    (statusCode = 500),
    (success = false),
    (data = null),
    (message = "An internal error occurred."),
    (error = true)
  );
};

module.exports = errorHandler;
