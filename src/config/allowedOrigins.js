// backend/config/cors/allowedOrigins.js
const { ALLOWED_ORIGINS } = require("./app.config");
const allowedOriginsString = ALLOWED_ORIGINS;

if (!allowedOriginsString) {
  throw new Error("Allowed origins must be set");
}

const allowedOrigins = allowedOriginsString.split(",");

module.exports = allowedOrigins;
