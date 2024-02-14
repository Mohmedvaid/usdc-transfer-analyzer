// src/task/storeTransactions.js
const Transaction = require("../models/Transaction.model");
const TaskTracker = require("../models/TaskTracker.model");
const transactionService = require("../services/transaction.service");

async function storeTransactions() {
  const taskTracker = new TaskTracker({ taskName: "Update Transactions" });
  await taskTracker.save();

  try {
    let lastSavedTransaction = await Transaction.findOne().sort({
      blockNumber: -1,
    });
    let lastSavedBlockNumber = lastSavedTransaction
      ? lastSavedTransaction.blockNumber
      : 0;
    let currentPage = 1;
    let pageSize = 100;
    let totalAdded = 0;

    while (true) {
      const newTransactions = await transactionService.fetchUSDCtransfers(
        currentPage,
        pageSize
      );
      if (!Array.isArray(newTransactions) || newTransactions.length === 0) {
        break;
      }

      let newTransactionsToSave = [];
      for (const transaction of newTransactions) {
        if (transaction.blockNumber <= lastSavedBlockNumber) {
          break;
        }
        newTransactionsToSave.push(transaction);
      }

      if (newTransactionsToSave.length > 0) {
        await Transaction.insertMany(newTransactionsToSave);
        lastSavedBlockNumber =
          newTransactionsToSave[newTransactionsToSave.length - 1].blockNumber;
        totalAdded += newTransactionsToSave.length;
      }

      if (newTransactions.length < pageSize) {
        break;
      }

      currentPage++;
    }

    taskTracker.status = "success";
    taskTracker.totalTransactionsAdded = totalAdded;
  } catch (error) {
    taskTracker.status = "fail";
    taskTracker.errorInfo = error.message;
  } finally {
    taskTracker.endTime = new Date();
    await taskTracker.save();
  }
}

module.exports = storeTransactions;
