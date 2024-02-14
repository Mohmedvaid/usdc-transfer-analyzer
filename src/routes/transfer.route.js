// backend/routes/index.js
const express = require("express");
const router = express.Router();
const usdcController = require("../controllers/transfer.controller");

router.get("/range", usdcController.transfersInTimeRange);
router.get("/total", usdcController.totalTransferred);
router.get("/accounts", usdcController.topAccounts);

module.exports = router;
