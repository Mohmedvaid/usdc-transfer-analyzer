// backend/routes/index.js
const express = require("express");
const router = express.Router();
const transferRoutes = require("./transfer.route");

router.get("/", (req, res) => res.json({ message: "API is healthy" }));

router.use("/transfer", transferRoutes);

module.exports = router;
