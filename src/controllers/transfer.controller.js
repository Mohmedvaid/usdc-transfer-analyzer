const transactionService = require("../services/transaction.service");
const isValidDateFormat = require("../utils/isValidDateFormat");
const CustomError = require("../utils/CustomError");

/**
 * Fetches all USDC transfers
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {Object} - Standardized response object
 */
exports.topAccounts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const topAccounts = await transactionService.getTopAccountsByVolume(limit);
    return res.standardResponse(200, true, topAccounts, "Success", false);
  } catch (error) {
    return next(error);
  }
};

/**
 * Fetches the total USDC transferred
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {Object} - Standardized response object
 */
exports.totalTransferred = async (req, res, next) => {
  try {
    const totalTransferred = await transactionService.getTotalUSDCTransferred();
    return res.standardResponse(
      200,
      true,
      { totalTransferred },
      "Success",
      false
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Fetches all USDC transfers in a given time range
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next function
 * @returns {Object} - Standardized response object
 */
exports.transfersInTimeRange = async (req, res, next) => {
  try {
    let { start, end } = req.query;

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

    // Edge case: start is required if end is provided
    if (!start && end) {
      return next(new CustomError("Start time is required with end", 400));
    }

    // Edge case: start should not be after end
    if (start && end) {
      if (new Date(start) > new Date(end)) {
        return next(new CustomError("Start time must be before end time", 400));
      }
    }

    // Default values
    const defaultStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const defaultEnd = new Date();

    // Assign default dates if necessary
    start = start ? new Date(start) : defaultStart;
    end = end ? new Date(end) : defaultEnd;

    const transfersInRange =
      await transactionService.getUSDCTransfersInTimeRange(start, end);

    return res.standardResponse(200, true, transfersInRange, "Success", false);
  } catch (error) {
    return next(error);
  }
};
