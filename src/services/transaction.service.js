// src/services/transaction.service.js
const mongoose = require("mongoose");
const Wallet = require("../models/Wallet.model");
const Transaction = require("../models/Transaction.model");

/**
 * Service class for transaction
 */
class TransactionService {
  /**
   * Constructor
   * @param {Array} transactions
   */
  constructor(transactions) {
    this.transactions = transactions;
  }

  /**
   * Saves multiple transactions to the database.
   * @param {Array} [transactions] - An optional array of transaction objects.
   * @returns {Promise<Array>} A promise that resolves with the saved transactions.
   */
  saveTransactions(transactions) {
    let transactionsToSave = transactions || this.transactions;
    return Transaction.insertMany(transactionsToSave);
  }

  /**
   * Updates wallets based on transaction data.
   * @param {Array} [transactions] - An optional array of transaction objects.
   * @returns {Promise<void>} A promise that resolves when all wallets are updated.
   */
  async updateWallets(transactions) {
    const transactionsToStore = transactions || this.transactions;
    for (const transaction of transactionsToStore) {
      await this.updateWallet(
        transaction.from,
        transaction._id,
        transaction.value,
        "sent"
      );
      await this.updateWallet(
        transaction.to,
        transaction._id,
        transaction.value,
        "received"
      );
    }
  }

  /**
   * Updates a single wallet based on a transaction.
   * @param {string} address - The wallet address.
   * @param {string} transactionId - The transaction ID.
   * @param {number} value - The transaction value.
   * @param {string} type - The transaction type (e.g., 'sent', 'received').
   * @returns {Promise<void>} A promise that resolves when the wallet is updated.
   */
  async updateWallet(address, transactionId, value, type) {
    let wallet = await Wallet.findOne({ address });
    if (!wallet) {
      wallet = new Wallet({ address });
    }

    if (type === "sent") {
      wallet.totalTransferred = mongoose.Types.Decimal128.fromString(
        (
          parseFloat(wallet.totalTransferred.toString()) + parseFloat(value)
        ).toString()
      );
      wallet.totalTransactionCount++;
    } else if (type === "received") {
      wallet.totalReceived = mongoose.Types.Decimal128.fromString(
        (
          parseFloat(wallet.totalReceived.toString()) + parseFloat(value)
        ).toString()
      );
    }

    wallet.transactions.push({ transactionId, type: type });
    await wallet.save();
  }
}

module.exports = TransactionService;
