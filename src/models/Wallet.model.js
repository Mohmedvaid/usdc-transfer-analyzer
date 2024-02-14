const mongoose = require("mongoose");
const Decimal128 = mongoose.Types.Decimal128;

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    type: { type: String, enum: ["sent", "received"] },
  },
  {
    _id: false,
    timestamps: true,
    autoCreate: true,
    versionKey: false,
  }
);

const walletSchema = new mongoose.Schema(
  {
    address: { type: String, required: true, unique: true },
    totalTransferred: { type: Decimal128, default: Decimal128.fromString("0") },
    totalReceived: { type: Decimal128, default: Decimal128.fromString("0") },
    totalTransactionCount: { type: Number, default: 0 },
    transactions: [transactionSchema],
  },
  {
    timestamps: true,
    autoCreate: true,
  }
);

walletSchema.index({ address: 1 });

module.exports = mongoose.model("Wallet", walletSchema);
