const transactionService = require("../services/transaction.service");
const CustomError = require("../utils/CustomError");

exports.topAccounts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const topAccounts = await transactionService.getTopAccountsByVolume(limit);
    return res.standardResponse(200, true, topAccounts, "Success", false);
  } catch (error) {
    return next(error);
  }
};

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

exports.transfersInTimeRange = async (req, res, next) => {
  try {
    let { starttime: startTime, endtime: endTime } = req.query;

    // Validate the date format
    if (startTime && !isValidDateFormat(startTime)) {
      const example = new Date().toISOString().split(".")[0];
      const errorMessage = `Invalid start time format. Expected format: YYYY-MM-DDTHH:mm:ss. Example: ${example}`;
      return next(new CustomError(errorMessage, 400));
    }

    if (endTime && !isValidDateFormat(endTime)) {
      const example = new Date().toISOString().split(".")[0];
      const errorMessage = `Invalid end time format. Expected format: YYYY-MM-DDTHH:mm:ss. Example: ${example}`;
      return next(new CustomError(errorMessage, 400));
    }

    // Default values
    const defaultStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    const defaultEnd = new Date();

    // Assign default dates if necessary
    startTime = startTime ? new Date(startTime) : defaultStart;
    endTime = endTime ? new Date(endTime) : defaultEnd;

    const transfersInRange =
      await transactionService.getUSDCTransfersInTimeRange(startTime, endTime);

    return res.standardResponse(200, true, transfersInRange, "Success", false);
  } catch (error) {
    return next(error);
  }
};

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function isValidDateFormat(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  return regex.test(dateString);
}
