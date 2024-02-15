// backend/routes/index.js
const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");
const {
  validateGet,
  validateGetById,
  validateGetByAddress,
} = require("../validators/wallet");

router.get("/", validateGet, walletController.get);
router.get("/:id", validateGetById, walletController.getById);
router.get("/address/:address", validateGetByAddress, walletController.getByAddress);

module.exports = router;
