const mongoose = require("mongoose");
const Wallet = require("../models/Wallet.model");
const Transaction = require("../models/Transaction.model");

// src/services/TransactionService.js
class TransactionService {
  constructor(transactions) {
    this.transactions = transactions;
  }

  saveTransactions(transactions) {
    let transactionsToSave = transactions || this.transactions;
    return Transaction.insertMany(transactionsToSave);
  }

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
