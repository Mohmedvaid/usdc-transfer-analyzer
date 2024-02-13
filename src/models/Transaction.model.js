const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    transactionHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    blockNumber: { type: Number, required: true },
    timestamp: { type: Date, required: true },
    fromAddress: { type: String, required: true, index: true },
    toAddress: { type: String, required: true, index: true },
    amount: { type: mongoose.Decimal128, required: true }, // Decimal128 for precision
    transactionIndex: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// index timestamsp
transactionSchema.index({ timestamp: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
