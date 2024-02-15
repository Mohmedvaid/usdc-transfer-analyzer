// backend/routes/index.js
const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");
const validateGet = require("../validators/get");

router.get("/", validateGet, walletController.get);
router.get("/:id", walletController.getById);
router.get("/:address", walletController.getByAddress);

module.exports = router;
