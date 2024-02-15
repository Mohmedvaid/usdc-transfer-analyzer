// src/routes/index.js
const express = require("express");
const router = express.Router();
const transferRoutes = require("./transaction.route");
const walletRoutes = require("./wallet.route");

// GET - /api
router.get("/", (req, res) => res.json({ message: "API is healthy" }));

// USE - /api/transaction
router.use("/transaction", transferRoutes);

// USE - /api/wallet
router.use("/wallet", walletRoutes);

module.exports = router;
