const Wallet = require("../models/Wallet.model");
const mongoose = require("mongoose");
const isValidMongooseId = require("../utils/isValidMongooseId");
const CustomError = require("../utils/CustomError");

exports.get = async (req, res, next) => {
  try {
    // Destructuring with default values for pagination
    let {
      start,
      end,
      limit = 10,
      page = 1,
      mintransferred: minTransferred,
      maxtransferred: maxTransferred,
      minreceived: minReceived,
      maxreceived: maxReceived,
    } = req.query;

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
    if (minTransferred || maxTransferred) {
      query.totalTransferred = {};
      if (minTransferred)
        query.totalTransferred["$gte"] =
          mongoose.Types.Decimal128.fromString(minTransferred);
      if (maxTransferred)
        query.totalTransferred["$lte"] =
          mongoose.Types.Decimal128.fromString(maxTransferred);
    }

    // Adding filters for totalReceived
    if (minReceived || maxReceived) {
      query.totalReceived = {};
      if (minReceived)
        query.totalReceived["$gte"] =
          mongoose.Types.Decimal128.fromString(minReceived);
      if (maxReceived)
        query.totalReceived["$lte"] =
          mongoose.Types.Decimal128.fromString(maxReceived);
    }

    // Calculating the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetching wallets and total count
    const [wallets, total] = await Promise.all([
      Wallet.find(query).skip(skip).limit(limit).select("-transactions"), 
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
      { wallets, pagination },
      "Wallets retrieved successfully",
      false
    );
  } catch (error) {
    // Handling errors
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
    const wallet = await Wallet.findById(req.params.id).populate({
      path: "transactions.transactionId",
      select: "-__v", // Excluding __v field from each populated transaction document
    });

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

exports.getByAddress = async (req, res, next) => {
  try {
    const { address } = req.params;
    // Fetching wallet by address
    const wallet = await Wallet.findOne({ address }).populate("transactions");

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
