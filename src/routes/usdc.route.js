// backend/routes/index.js
const express = require("express");
const router = express.Router();
const usdcController = require("../controllers/usdc.controller");

router.get("/top-accounts", usdcController.topAccounts);
router.get("/total-transferred", usdcController.totalTransferred);
router.get("/transfers-in-time-range", usdcController.transfersInTimeRange);

module.exports = router;
