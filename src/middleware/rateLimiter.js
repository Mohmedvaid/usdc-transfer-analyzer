const rateLimit = require("express-rate-limit");
const {
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
} = require("../config/app.config");

const rateLimitWindowMs = parseInt(RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // Fallback to 15 minutes if not set
const rateLimitMaxRequests = parseInt(RATE_LIMIT_MAX_REQUESTS, 10) || 100; // Fallback to 100 if not set

const limiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMaxRequests,
});

module.exports = limiter;
