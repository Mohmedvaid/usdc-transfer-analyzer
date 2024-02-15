// backend/routes/index.js
const express = require("express");
const router = express.Router();
const usdcController = require("../controllers/transfer.controller");
const validateTransactionQuery = require("../validators/get");

router.get("/", validateTransactionQuery, usdcController.transfersInTimeRange);
router.get("/wallets", usdcController.totalTransferred);
router.get("/top-accounts", usdcController.topAccounts);

module.exports = router;
