// src/config/app.config.js

// Centralized configuration for the application
module.exports = {
  ENV: process.env.ENV || "DEVELOPMENT",
  PORT: process.env.PORT || 3000,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  AVALANCHE_NODE_URL: process.env.AVALANCHE_NODE_URL,
  USDC_CONTRACT_ADDRESS: process.env.USDC_CONTRACT_ADDRESS,
  DB_URI: process.env.DB_URI,
};
