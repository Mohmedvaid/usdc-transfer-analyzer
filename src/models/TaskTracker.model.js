// src/models/TaskTracker.model.js
const mongoose = require("mongoose");

const taskTrackerSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["running", "success", "fail"],
    default: "running",
  },
  totalTransactionsAdded: {
    type: Number,
    default: 0,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  errorInfo: {
    type: String,
  },
});

const TaskTracker = mongoose.model("TaskTracker", taskTrackerSchema);

module.exports = TaskTracker;
