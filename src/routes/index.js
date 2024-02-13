// backend/routes/index.js
const express = require("express");
const router = express.Router();
const service = require("../services/blockchain.service");

router.get("/", (req, res) => res.json({ message: "API is healthy" }));

router.get("/fetch-usdc-transfers", async (req, res, next) => {
  try {
    const startBlock = 1000000;
    const endBlock = 1001000;
    const events = await service.fetchUSDCtransfers();
    return res.standardResponse(200, true, events, "Success", false);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
