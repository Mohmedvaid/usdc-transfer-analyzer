// backend/routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.json({ message: "API is healthy" }));

module.exports = router;
