// backend/routes/index.js
const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const validateGet = require("../validators/transaction");

router.get("/", validateGet, transactionController.get);
router.get("/:id", transactionController.getById);

module.exports = router;
