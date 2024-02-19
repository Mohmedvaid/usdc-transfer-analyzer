// src/task/storeTransactions.js
const Transaction = require("../models/Transaction.model");
const TaskTracker = require("../models/TaskTracker.model");
const TransactionService = require("../services/transaction.service");
const Web3 = require("../services/web3.service");

/**
 * Stores transactions in the database.
 * @returns {Promise<void>} A promise that resolves when the transactions are stored.
 * @async
 */
const storeTransactions = async () => {
  const taskTracker = new TaskTracker({ taskName: "Update Transactions" });
  await taskTracker.save();

  try {
    const lastSavedTransaction = await Transaction.findOne().sort({
      blockNumber: -1,
    });
    if (!lastSavedTransaction) throw new Error("No transactions found");

    const pageSize = 100;
    let currentPage = 1;
    let totalAdded = 0;
    let isLastBlockFound = false;

    while (true) {
      const newTransactions = await Web3.fetchUSDCtransfers(
        currentPage,
        pageSize
      );
      if (!Array.isArray(newTransactions) || newTransactions.length === 0)
        break;

      const transactionService = new TransactionService(newTransactions);
      let transactionsToSave = [];

      const foundIdx = newTransactions.findIndex((transaction) => {
        return (
          transaction.from === lastSavedTransaction.from &&
          transaction.to === lastSavedTransaction.to &&
          transaction.blockNumber === lastSavedTransaction.blockNumber &&
          transaction.transactionHash === lastSavedTransaction.transactionHash
        );
      });

      // If last saved transaction is found, save only the transactions before it, else save all
      if (foundIdx !== -1) {
        transactionsToSave = newTransactions.slice(0, foundIdx);
        isLastBlockFound = true;
      } else {
        transactionsToSave = newTransactions;
      }

      if (transactionsToSave.length > 0) {
        const savedTransactions = await transactionService.saveTransactions(
          transactionsToSave
        );
        console.log(savedTransactions[0]);
        await transactionService.updateWallets(savedTransactions);
        totalAdded += transactionsToSave.length;
      }

      console.log(`Page ${currentPage} transactions added: ${totalAdded}`);
      if (isLastBlockFound) break;

      currentPage++;
    }

    taskTracker.status = "success";
    taskTracker.totalTransactionsAdded = totalAdded;
  } catch (error) {
    console.error("Error storing transactions:", error);
    taskTracker.status = "fail";
    taskTracker.errorInfo = error.message;
    throw error;
  } finally {
    taskTracker.endTime = new Date();
    await taskTracker.save();
  }
};

module.exports = storeTransactions;
