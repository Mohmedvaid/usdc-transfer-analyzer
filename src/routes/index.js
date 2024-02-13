// backend/routes/index.js
const express = require("express");
const router = express.Router();
const service = require("../services/blockchain.service");

router.get("/", (req, res) => res.json({ message: "API is healthy" }));

router.get("/fetch-usdc-transfers", async (req, res, next) => {
  try {
    const events = await service.fetchUSDCtransfers(0, "latest");
    return res.standardResponse(200, true, events, "Success", false);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
