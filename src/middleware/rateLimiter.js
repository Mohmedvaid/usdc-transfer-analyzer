const rateLimit = require("express-rate-limit");

const rateLimitWindowMs =
  parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // Fallback to 15 minutes if not set
const rateLimitMaxRequests =
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100; // Fallback to 100 if not set

const limiter = rateLimit({
  windowMs: rateLimitWindowMs,
  max: rateLimitMaxRequests,
});

module.exports = limiter;
