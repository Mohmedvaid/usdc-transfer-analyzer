const crypto = require("crypto");
const mongoose = require("mongoose");
const { transactions } = require("../config/testdata.config");

const getTransactions = () => {
  let testData = [];

  transactions.items.forEach((item) => {
    for (let i = 0; i < item.qty; i++) {
      testData.push({
        from: item.from,
        to: item.to,
        value: mongoose.Types.Decimal128.fromString(item.amount.toString()),
        blockNumber: (Math.floor(Math.random() * 10000) + 1).toString(),
        transactionHash: crypto.randomBytes(32).toString("hex"),
        transactionIndex: (Math.floor(Math.random() * 100) + 1).toString(),
        blockHash: crypto.randomBytes(32).toString("hex"),
        logIndex: (Math.floor(Math.random() * 100) + 1).toString(),
        createdAt: new Date(item.date),
      });
    }
  });

  return testData;
};

module.exports = { getTransactions };
