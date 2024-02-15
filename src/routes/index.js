// backend/routes/index.js
const express = require("express");
const router = express.Router();
const transferRoutes = require("./transaction.route");
const walletRoutes = require("./wallet.route");

router.get("/", (req, res) => res.json({ message: "API is healthy" }));

router.use("/transaction", transferRoutes);
router.use("/wallet", walletRoutes);

module.exports = router;
