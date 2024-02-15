const mongoose = require("mongoose");
const Wallet = require("../models/Wallet.model");

// todo: optimize it with upsert
/**
 * Updates the sender wallet.
 * @param {string} address - The wallet address.
 * @param {string} transactionId - The transaction ID.
 * @param {string} value - The value of the transaction.
 * @returns {Promise<void>} A promise that resolves when the sender wallet is updated.
 */
const updateSenderWallet = async (address, transactionId, value) => {
  let wallet = await Wallet.findOne({ address });
  if (!wallet) {
    wallet = new Wallet({ address });
  }
  wallet.totalTransferred = mongoose.Types.Decimal128.fromString(
    (
      parseFloat(wallet.totalTransferred.toString()) + parseFloat(value)
    ).toString()
  );
  wallet.totalTransactionCount++;
  wallet.transactions.push(transactionId);
  await wallet.save();
};

module.exports = updateSenderWallet;
