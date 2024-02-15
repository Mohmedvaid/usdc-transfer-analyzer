// src/routes/transaction.route.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const { validateGet, validateGetById } = require("../validators/transaction");

// GET - /api/transaction
router.get("/", validateGet, transactionController.get);

// GET - /api/transaction/:id
router.get("/:id", validateGetById, transactionController.getById);

module.exports = router;
