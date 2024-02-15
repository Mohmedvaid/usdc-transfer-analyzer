const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    value: { type: mongoose.Decimal128, required: true }, // Decimal128 for precision
    blockNumber: { type: String, required: true },
    transactionHash: { type: String, required: true },
    transactionIndex: { type: Number, required: true },
    blockHash: { type: String, required: true },
    logIndex: { type: String, required: true },
  },
  {
    timestamps: true,
    autoCreate: true,
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        ret.value = ret.value.toString();

        // remove createdAt and updatedAt
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
  }
);

// index timestamsp
transactionSchema.index({ transactionHash: 1 });
transactionSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Transaction", transactionSchema);
