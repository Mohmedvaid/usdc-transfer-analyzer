// src/utils/validateEnv.js

/**
 * Validate the required environment variables
 * @returns {undefined} - exits the process if required environment variables are missing
 */
const validateEnv = () => {
  const requiredEnv = [
    "ENV",
    "PORT",
    "ALLOWED_ORIGINS",
    "AVALANCHE_NODE_URL",
    "USDC_CONTRACT_ADDRESS",
    "DB_URI",
    "RATE_LIMIT_WINDOW_MS",
    "RATE_LIMIT_MAX_REQUESTS",
  ];
  const missingEnv = requiredEnv.filter((envVar) => !process.env[envVar]);
  if (missingEnv.length) {
    console.error(
      `Missing required environment variables: ${missingEnv.join(", ")}`
    );
    process.exit(1);
  }
};

module.exports = validateEnv;
