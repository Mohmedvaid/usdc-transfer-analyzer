// backend/routes/index.js
const express = require("express");
const router = express.Router();
const usdcController = require("../controllers/usdc.controller");
const validateGet = require("../validate/usdc/get");

router.get("/", (req, res) => res.json({ message: "API is healthy" }));

router.get("/usdc", validateGet, usdcController.get);

module.exports = router;
