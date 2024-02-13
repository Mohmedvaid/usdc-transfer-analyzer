// backend/routes/index.js
const express = require("express");
const router = express.Router();
const usdcController = require("../controller/usdc.controller");
const validateGet = require("../validate/usdc/get");

router.get("/", validateGet, usdcController.get);

module.exports = router;
