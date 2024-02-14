// src/seeders/seedTransactions.js
require("dotenv").config();
const Transaction = require("../models/Transaction.model");
const transactionService = require("../services/transaction.service");
const { connect, disconnect } = require("../config/db/connection");

async function seedTransactions() {
  try {
    await connect();

    const existingTransactionsCount = await Transaction.countDocuments();
    if (existingTransactionsCount === 0) {
      console.log("Seeding transactions...");

      const transactions = await transactionService.fetchUSDCtransfers(1, 100);
      console.log(`${transactions.length} transactions fetched.`);

      // Group events by transactionHash
      const groupedTransactions = transactions.reduce((acc, transaction) => {
        acc[transaction.transactionHash] = acc[transaction.transactionHash] || {
          transactionHash: transaction.transactionHash,
          blockNumber: transaction.blockNumber,
          transactionIndex: transaction.transactionIndex,
          blockHash: transaction.blockHash,
          events: [],
        };
        acc[transaction.transactionHash].events.push({
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          logIndex: transaction.logIndex,
        });
        return acc;
      }, {});

      const uniqueTransactions = Object.values(groupedTransactions);

      if (uniqueTransactions && uniqueTransactions.length > 0) {
        await Transaction.insertMany(uniqueTransactions);
        console.log(
          `${uniqueTransactions.length} transactions seeded successfully.`
        );
      } else {
        console.log("No transactions fetched to seed.");
      }
    } else {
      console.log("Transactions already seeded.");
    }
  } catch (error) {
    console.error("Error seeding transactions:", error);
  } finally {
    await disconnect();
  }
}

seedTransactions();
