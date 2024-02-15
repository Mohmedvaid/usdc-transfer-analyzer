const Transaction = require("../models/Transaction.model");
const mongoose = require("mongoose");
const isValidMongooseId = require("../utils/isValidMongooseId");
const CustomError = require("../utils/CustomError");

exports.get = async (req, res, next) => {
  try {
    // Destructuring with default values for pagination
    let { start, end, limit, page, min, max, from, to } = req.query;

    // Parsing limit and page to ensure they are integers
    limit = parseInt(limit);
    page = Math.max(1, parseInt(page)); // Page should be at least 1

    // Building the date range filter
    let dateFilter = {};
    if (start) dateFilter["$gte"] = new Date(start);
    if (end) dateFilter["$lte"] = new Date(end);

    // Building the query object
    let query = {};
    if (start || end) {
      query.createdAt = dateFilter;
    }

    // Adding filters for totalTransferred
    if (min || max) {
      query.value = {};
      if (min) query.value["$gte"] = mongoose.Types.Decimal128.fromString(min);
      if (max) query.value["$lte"] = mongoose.Types.Decimal128.fromString(max);
    }

    if (from) query.from = from;
    if (to) query.to = to;

    // Calculating the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetching wallets and total count
    const [transactions, total] = await Promise.all([
      Transaction.find(query).skip(skip).limit(limit),
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
      200,
      true,
      { transactions, pagination },
      "Transactions retrieved successfully",
      false
    );
  } catch (error) {
    return next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // if not id, or string or not a valid mongoose id return error
    if (!id || typeof id !== "string" || !isValidMongooseId(id)) {
      return next(new CustomError("Invalid id", 400));
    }
    // Fetching wallet by id
    const wallet = await Transaction.findById(req.params.id);

    // Sending the response
    return res.standardResponse(
      200,
      true,
      wallet,
      "Wallet retrieved successfully",
      false
    );
  } catch (error) {
    // Handling errors
    return next(error);
  }
};
