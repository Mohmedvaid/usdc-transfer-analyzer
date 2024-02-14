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
    return res.standardResponse(
      (statusCode = 200),
      (success = true),
      (data = topAccounts),
      (message = "Success"),
      (error = false)
    );
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
      (statusCode = 200),
      (success = true),
      (data = { totalTransferred }),
      (message = "Success"),
      (error = false)
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
    let { start, end, limit = 10, page = 1 } = req.query;

    // Default values
    const defaultStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const defaultEnd = new Date();

    // Assign default dates if necessary
    start = start ? new Date(start) : defaultStart;
    end = end ? new Date(end) : defaultEnd;

    const offset = (page - 1) * limit;

    const transfersInRange =
      await transactionService.getUSDCTransfersInTimeRange(
        start,
        end,
        limit,
        offset
      );

    const totalRecords = await transactionService.countUSDCTransfersInTimeRange(
      start,
      end
    );
    const totalPages = Math.ceil(totalRecords / limit);

    const data = {
      transfers: transfersInRange,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },
    };

    return res.standardResponse(
      (statusCode = 200),
      (success = true),
      data,
      (message = "Success"),
      (error = false)
    );
  } catch (error) {
    return next(error);
  }
};
