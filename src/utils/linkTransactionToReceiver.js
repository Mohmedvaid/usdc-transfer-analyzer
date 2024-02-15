const Wallet = require("../models/Wallet.model");

/**
 * Links a transaction to a receiver.
 * @param {string} address - The wallet address.
 * @param {string} transactionId - The transaction ID.
 * @returns {Promise<void>} A promise that resolves when the transaction is linked to the receiver.
 */
const linkTransactionToReceiver = async (address, transactionId) => {
  if (!address) return;
  if (!transactionId) return;

  let wallet = await Wallet.findOne({ address });
  if (!wallet) wallet = new Wallet({ address });

  wallet.transactions.push(transactionId);
  await wallet.save();
};

module.exports = linkTransactionToReceiver;
