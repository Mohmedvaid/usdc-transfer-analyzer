// src/seeders/seedTransactions.js
const Transaction = require("../models/Transaction.model");
const Web3 = require("../services/web3.service");
const TransactionService = require("../services/transaction.service");

const seedTransactions = async () => {
  try {
    console.log("Seeding transactions...");

    const transactions = await Web3.fetchUSDCtransfers(1, 100);
    console.log(`${transactions.length} transactions fetched.`);

    const transactionService = new TransactionService(transactions);

    if (transactions && transactions.length > 0) {
      const savedTransactions = await transactionService.saveTransactions();
      await transactionService.updateWallets(savedTransactions);

      console.log(`${transactions.length} transactions seeded successfully.`);
    } else {
      console.log("No transactions fetched to seed.");
    }
  } catch (error) {
    console.error("Error seeding transactions:", error);
    throw error;
  }
};

module.exports = seedTransactions;
