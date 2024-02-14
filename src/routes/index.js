// backend/routes/index.js
const express = require("express");
const router = express.Router();
const usdcController = require("../controllers/usdc.controller");
const validateGet = require("../validate/usdc/get");
const usdcRoutes = require("./usdc.route");

router.get("/", (req, res) => res.json({ message: "API is healthy" }));

router.use("/usdc", usdcRoutes);

module.exports = router;
