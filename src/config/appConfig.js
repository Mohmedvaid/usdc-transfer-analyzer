// src/config/appConfig.js

// Centralized configuration for the application
module.exports = {
  ENV: process.env.ENV || "DEVELOPMENT",
  PORT: process.env.PORT || 3000,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "",
};
