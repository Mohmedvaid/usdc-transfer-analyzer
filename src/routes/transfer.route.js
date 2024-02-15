// backend/routes/index.js
const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transfer.controller");
const validateGet = require("../validators/get");

router.get("/", validateGet, transferController.get);
router.get("/:id", transferController.getById);

module.exports = router;
