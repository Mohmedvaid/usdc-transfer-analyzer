// src/validators/transaction.js
const mongoose = require("mongoose");
const CustomError = require("../utils/CustomError");
const isValidDateFormat = require("../utils/isValidDateFormat");
const isValidAddress = require("../utils/isValidAddress");
const isValidMongooseId = require("../utils/isValidMongooseId");

/**
 * Middleware to validate query parameters for get data.
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const validateGet = (req, res, next) => {
  let { start, end, min, max, from, to, limit = "10", page = "1" } = req.query;

  // Validate the date format
  if (start && !isValidDateFormat(start)) {
    const example = new Date().toISOString().split(".")[0];
    const errorMessage = `Invalid start time format. Expected format: YYYY-MM-DDTHH:mm:ss. Example: ${example}`;
    return next(new CustomError(errorMessage, 400));
  }

  if (end && !isValidDateFormat(end)) {
    const example = new Date().toISOString().split(".")[0];
    const errorMessage = `Invalid end time format. Expected format: YYYY-MM-DDTHH:mm:ss. Example: ${example}`;
    return next(new CustomError(errorMessage, 400));
  }

  // Validate min and max numbers
  if (min && isNaN(min)) return next(new CustomError("Invalid min value", 400));

  if (max && isNaN(max)) return next(new CustomError("Invalid max value", 400));

  // Validate addresses
  if (from && !isValidAddress(from))
    return next(new CustomError("Invalid from address", 400));

  if (to && !isValidAddress(to))
    return next(new CustomError("Invalid to address", 400));

  // Edge case: start is required if end is provided
  if (!start && end)
    return next(new CustomError("Start time is required with end", 400));

  // Edge case: start should not be after end
  if (start && end) {
    if (new Date(start) > new Date(end))
      return next(new CustomError("Start time must be before end time", 400));
  }

  // Validate limit and page
  limit = parseInt(limit);
  page = parseInt(page);

  if (isNaN(limit) || limit <= 0)
    return next(new CustomError("Invalid limit value", 400));

  if (isNaN(page) || page <= 0)
    return next(new CustomError("Invalid page number", 400));

  // Add validated and parsed values back to req.query
  req.query.limit = limit;
  req.query.page = page;
  req.query.start = start ? new Date(start) : undefined;
  req.query.end = end ? new Date(end) : undefined;
  req.query.min = min ? mongoose.Types.Decimal128.fromString(min) : undefined;
  req.query.max = max ? mongoose.Types.Decimal128.fromString(max) : undefined;

  return next();
};

const validateGetById = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || !isValidMongooseId(id))
    return next(new CustomError("Invalid id", 400));

  return next();
};

module.exports = { validateGet, validateGetById };
