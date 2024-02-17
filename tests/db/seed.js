// src/seeders/seedTransactions.js
const { getTransactions } = require("../utils/dataGenerator");
const TransactionService = require("../../src/services/transaction.service");

const seedTransactions = async () => {
  try {
    console.log("Seeding transactions...");

    const transactions = getTransactions();
    console.log(`${transactions.length} transactions fetched.`);

    const transactionService = new TransactionService(transactions);

    if (transactions && transactions.length > 0) {
      const savedTransactions = await transactionService.saveTransactions();
      console.log(`${savedTransactions.length} transactions saved.`);
      const savedWallets = await transactionService.updateWallets(
        savedTransactions
      );

      console.log(`${transactions.length} transactions seeded successfully.`);
      return { savedTransactions, savedWallets };
    } else {
      console.log("No transactions fetched to seed.");
    }
  } catch (error) {
    console.error("Error seeding transactions:", error);
    throw error;
  }
};

module.exports = seedTransactions;
