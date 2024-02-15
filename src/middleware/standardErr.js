//  src/middleware/standardErr.js
const logger = require("../utils/logger");
const CustomError = require("../utils/CustomError");

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
  console.error(err, "\n");
  logger.error(err.stack);

  if (err instanceof CustomError) {
    const code = err.statusCode || 500;
    const message = err.message || "An error occurred.";
    return res.standardResponse(
      (statusCode = code),
      (success = false),
      (data = null),
      (message = message),
      (error = true)
    );
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
