// src/middleware/standardRes.js

/**
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {Function} - Standardized response function
 */

const standardizeResponse = (req, res, next) => {
  res.standardResponse = (
    statusCode,
    success,
    data = null,
    message = null,
    error = null
  ) => {
    const response = {
      success: success,
      message: message,
      data: data,
      error: error,
    };

    res.status(statusCode).json(response);
  };

  next();
};

module.exports = standardizeResponse;
