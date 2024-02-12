//  src/middleware/standardErr.js
const logger = require("../config/logger");
const CustomError = require("../utils/CustomError");

/**
 * Global error handler middleware
 * @param {Object} err
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Function} - Standardized response function
 */
const errorHandler = (err, req, res, next) => {
  // Log the error for server side tracking
  console.error(err, "\n");
  logger.error(err.stack);

  if (err instanceof CustomError) {
    const code = err.statusCode || 500;
    const message = err.message || "An error occurred.";
    return res.standardResponse(code, false, null, message, true);
  }

  return res.standardResponse(
    500,
    false,
    null,
    "An internal server error occurred.",
    true
  );
};

module.exports = errorHandler;
