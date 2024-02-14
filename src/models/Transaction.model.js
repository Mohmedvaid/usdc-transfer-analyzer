const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    from: { type: String, required: true, index: true },
    to: { type: String, required: true, index: true },
    value: { type: mongoose.Decimal128, required: true }, // Decimal128 for precision
    logIndex: { type: Number, required: true },
  },
  {
    timestamps: true,
    autoCreate: true,
    _id: false,
  }
);

const transactionSchema = new mongoose.Schema(
  {
    transactionHash: { type: String, required: true, unique: true },
    blockNumber: { type: Number, required: true },
    transactionIndex: { type: Number, required: true },
    blockHash: { type: String, required: true },
    events: [eventSchema],
  },
  {
    timestamps: true,
    autoCreate: true,
  }
);

// index timestamsp
transactionSchema.index({ transactionHash: 1 });
transactionSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
