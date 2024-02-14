// src/seeders/seedTransactions.js
require("dotenv").config();
const Transaction = require("../models/Transaction.model");
const transferService = require("../services/transfer.service");
const TransactionService = require("../services/transaction.service");
const { connect, disconnect } = require("../config/db/connection");

const seedTransactions = async () => {
  try {
    await connect();

    const existingTransactionsCount = await Transaction.countDocuments();
    if (existingTransactionsCount === 0) {
      console.log("Seeding transactions...");

      const transactions = await transferService.fetchUSDCtransfers(1, 100);
      console.log(`${transactions.length} transactions fetched.`);

      const transactionService = new TransactionService(transactions);

      if (transactions && transactions.length > 0) {
        const savedTransactions = await transactionService.saveTransactions();
        await transactionService.updateWallets(savedTransactions);

        console.log(`${transactions.length} transactions seeded successfully.`);
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
};

seedTransactions();
