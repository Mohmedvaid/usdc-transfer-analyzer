// src/routes/wallet.route.js
const express = require("express");
const router = express.Router();
const walletController = require("../controllers/wallet.controller");
const {
  validateGet,
  validateGetById,
  validateGetByAddress,
} = require("../validators/wallet");

// GET - /api/wallet
router.get("/", validateGet, walletController.get);

// GET - /api/wallet/:id
router.get("/:id", validateGetById, walletController.getById);

// GET - /api/wallet/address/:address
router.get(
  "/address/:address",
  validateGetByAddress,
  walletController.getByAddress
);

module.exports = router;
