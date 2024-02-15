// src/models/Wallet.model.js
const mongoose = require("mongoose");
const Decimal128 = mongoose.Types.Decimal128;

const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    type: { type: String, enum: ["sent", "received"] },
  },
  {
    _id: false,
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
    versionKey: false,
    toJSON: {
      // convert Decimal128 to string
      transform: function (doc, ret) {
        if (ret.totalTransferred) {
          ret.totalTransferred = ret.totalTransferred.toString();
        }
        if (ret.totalReceived) {
          ret.totalReceived = ret.totalReceived.toString();
        }

        // remove createdAt and updatedAt
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

walletSchema.index({ address: 1 });

module.exports = mongoose.model("Wallet", walletSchema);
