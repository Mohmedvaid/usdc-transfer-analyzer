// src/services/transaction.service.js
const { USDC_CONTRACT_ADDRESS } = require("../config/app.config");
const USDC_CONTRACT_ABI = require("../config/usdc.abi.json");
const blockchainService = require("./blockchain.service");
const Transaction = require("../models/Transaction.model");

class TransactionService {
  constructor() {
    this.web3 = blockchainService.getWeb3Instance();
    this.usdcContract = new this.web3.eth.Contract(
      USDC_CONTRACT_ABI,
      USDC_CONTRACT_ADDRESS
    );
  }

  async fetchUSDCtransfers(pageNumber = 1, pageSize = 100) {
    let events = [];
    try {
      const latest = BigInt(await this.web3.eth.getBlockNumber());

      // Validate and set maximum page size
      pageSize = pageSize > 2000 ? 2000 : pageSize;

      // Calculate fromBlock and toBlock based on page number
      const toBlock = latest - BigInt((pageNumber - 1) * pageSize);
      const fromBlock = toBlock - BigInt(pageSize);

      const batchEvents = await this.usdcContract.getPastEvents("Transfer", {
        fromBlock,
        toBlock,
      });

      events = batchEvents.map((event) => {
        const valueString = event.returnValues.value
          ? event.returnValues.value.toString()
          : "0";
        const usdcValue = this.web3.utils.fromWei(valueString, "mwei");
        return {
          from: event.returnValues.from,
          to: event.returnValues.to,
          value: usdcValue,
          blockNumber: event.blockNumber.toString(),
          transactionHash: event.transactionHash,
          transactionIndex: event.transactionIndex.toString(),
          blockHash: event.blockHash,
          logIndex: event.logIndex.toString(),
        };
      });

      return events;
    } catch (error) {
      console.error("Error fetching USDC transfers");
      throw error;
    }
  }

  async getTopAccountsByVolume(limit = 10) {
    const topAccounts = await Transaction.aggregate([
      { $unwind: "$events" },
      {
        $group: {
          _id: "$events.to",
          totalValue: { $sum: "$events.value" },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: limit },
      {
        $project: {
          address: "$_id",
          totalValue: { $toString: "$totalValue" }, // Convert Decimal128 to string
          _id: 0,
        },
      },
    ]);

    return topAccounts;
  }

  async getTotalUSDCTransferred() {
    const result = await Transaction.aggregate([
      { $unwind: "$events" },
      {
        $group: {
          _id: null,
          totalTransferred: { $sum: "$events.value" },
        },
      },
      {
        $project: {
          _id: 0,
          totalTransferred: { $toString: "$totalTransferred" }, // Convert Decimal128 to string
        },
      },
    ]);

    // The result is an array with a single object, so we access the first element.
    return result.length > 0 ? result[0].totalTransferred : "0";
  }

  async getUSDCTransfersInTimeRange(startTime, endTime, limit, offset) {
    const transfersInRange = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startTime, $lte: endTime },
        },
      },
      { $unwind: "$events" },
      {
        $project: {
          _id: 0,
          from: "$events.from",
          to: "$events.to",
          value: { $toString: "$events.value" },
          logIndex: "$events.logIndex",
          createdAt: "$events.createdAt",
          updatedAt: "$events.updatedAt",
        },
      },
      { $skip: offset },
      { $limit: limit },
    ]);

    return transfersInRange;
  }

  async countUSDCTransfersInTimeRange(startTime, endTime) {
    const totalRecords = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startTime, $lte: endTime },
        },
      },
      { $unwind: "$events" },
      { $count: "total" },
    ]);

    return totalRecords.length > 0 ? totalRecords[0].total : 0;
  }
}

module.exports = new TransactionService();
