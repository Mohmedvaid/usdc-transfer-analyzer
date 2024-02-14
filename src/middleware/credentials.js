// src/middleware/credentials.js
const allowedOrigins = require("../config/origin.config");

/**
 * Middleware to check if the request origin is allowed
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {Function} - Next function
 */
const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  return next();
};

module.exports = credentials;
