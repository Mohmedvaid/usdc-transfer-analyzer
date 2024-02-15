const mongoose = require("mongoose");
const CustomError = require("../utils/CustomError");
const isValidDateFormat = require("../utils/isValidDateFormat");
const isValidMongooseId = require("../utils/isValidMongooseId");
// const sanitize = require("../utils/sanitize");
const isValidAddress = require("../utils/isValidAddress");

/**
 * Middleware to validate query parameters for get data.
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const validateGet = (req, res, next) => {
  let {
    start,
    end,
    mintransferred,
    maxtransferred,
    minreceived,
    maxreceived,
    limit = "10",
    page = "1",
  } = req.query;

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
  if (mintransferred && isNaN(mintransferred))
    return next(new CustomError("Invalid mintransferred value", 400));

  if (maxtransferred && isNaN(maxtransferred))
    return next(new CustomError("Invalid maxtransferred value", 400));

  if (minreceived && isNaN(minreceived))
    return next(new CustomError("Invalid minreceived value", 400));

  if (maxreceived && isNaN(maxreceived))
    return next(new CustomError("Invalid maxreceived value", 400));

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
  req.query.mintransferred = mintransferred
    ? mongoose.Types.Decimal128.fromString(mintransferred)
    : undefined;
  req.query.maxtransferred = maxtransferred
    ? mongoose.Types.Decimal128.fromString(maxtransferred)
    : undefined;
  req.query.minreceived = minreceived
    ? mongoose.Types.Decimal128.fromString(minreceived)
    : undefined;
  req.query.maxreceived = maxreceived
    ? mongoose.Types.Decimal128.fromString(maxreceived)
    : undefined;

  return next();
};

const validateGetById = (req, res, next) => {
  const { id } = req.params;

  // if not id, or string or not a valid mongoose id return error
  if (!id || typeof id !== "string" || !isValidMongooseId(id)) {
    return next(new CustomError("Invalid id", 400));
  }

  return next();
};

const validateGetByAddress = (req, res, next) => {
  const { address } = req.params;

  // if not address, or string return error
  if (!address || typeof address !== "string" || !isValidAddress(address)) {
    return next(new CustomError("Invalid address", 400));
  }

  return next();
};

module.exports = { validateGet, validateGetById, validateGetByAddress };
