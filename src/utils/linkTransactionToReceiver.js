const Wallet = require("../models/Wallet.model");

const linkTransactionToReceiver = async (address, transactionId) => {
  let wallet = await Wallet.findOne({ address });
  if (!wallet) {
    wallet = new Wallet({ address });
  }
  wallet.transactions.push(transactionId);
  await wallet.save();
};

module.exports = linkTransactionToReceiver;
