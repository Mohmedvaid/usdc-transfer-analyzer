// src/controllers/transaction.controller.js
const Transaction = require("../models/Transaction.model");
const isValidMongooseId = require("../utils/isValidMongooseId");
const CustomError = require("../utils/CustomError");

/**
 * Function to get transactions with pagination and filters.
 * @param {Express.Request} req - Request object
 * @param {Express.Response} res - Response object
 * @param {Express.NextFunction} next - Next middleware function
 * @returns {Promise<void>}
 */
exports.get = async (req, res, next) => {
  try {
    // Destructuring with default values for pagination
    let { start, end, limit, page, min, max, from, to } = req.query;

    // Building the date range filter
    let dateFilter = {};
    if (start) dateFilter["$gte"] = start;
    if (end) dateFilter["$lte"] = end;

    // Building the query object
    let query = {};
    if (start || end) query.createdAt = dateFilter;

    // Adding filters for totalTransferred
    if (min || max) {
      query.value = {};
      if (min) query.value["$gte"] = min;
      if (max) query.value["$lte"] = max;
    }

    if (from) query.from = from;
    if (to) query.to = to;

    // Calculating the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetching wallets and total count
    const [transactions, total] = await Promise.all([
      Transaction.find(query).skip(skip).limit(limit),
      Transaction.countDocuments(query),
    ]);

    // Calculating the number of pages
    const totalPages = Math.ceil(total / limit);
    const pagination = {
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
      totalPages: totalPages,
      totalItems: total,
    };

    // Sending the response
    return res.standardResponse(
      (statusCode = 200),
      (success = true),
      (data = { transactions, pagination }),
      (message = "Transactions retrieved successfully"),
      (error = false)
    );
  } catch (error) {
    return next(error);
  }
};

/**
 * Function to get transaction by id.
 * @param {Express.Request} req - Request object
 * @param {Express.Response} res - Response object
 * @param {Express.NextFunction} next - Next middleware function
 * @returns {Promise<void>}
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string" || !isValidMongooseId(id))
      return next(new CustomError("Invalid id", 400));

    const transaction = await Transaction.findById(id);

    if (!transaction)
      return next(new CustomError("Transaction not found", 404));

    // Sending the response
    return res.standardResponse(
      (statusCode = 200),
      (success = true),
      (data = transaction),
      (message = "Transaction retrieved successfully"),
      (error = false)
    );
  } catch (error) {
    return next(error);
  }
};
