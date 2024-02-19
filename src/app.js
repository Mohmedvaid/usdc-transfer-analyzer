// src/app.js
require("dotenv").config();

// validateEnv.js - validate the required environment variables
require("./utils/validateEnv")();

// External imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Local imports
const { ENV } = require("./config/app.config");
const corsOptions = require("./config/corsOptions.config");
const rateLimiter = require("./middleware/rateLimiter");
const credentials = require("./middleware/credentials");
const standardResponse = require("./middleware/standardRes");
const standardError = require("./middleware/standardErr");
const routes = require("./routes");
const { connect, disconnect } = require("./config/db/connection");
const updateTransactions = require("./task/storeTransactions");

const app = express();

if (ENV !== "TEST") {
  // Connect to the database
  connect()
    .then(() => console.log("Database connected"))
    .catch((err) => {
      console.error("Database connection error", err);
      process.exit(1);
    });
}

// Rate limiting
app.use(rateLimiter);

// Global response handler
app.use(standardResponse);

// Middleware for CORS
app.use(credentials);
app.use(cors(corsOptions));

if (ENV === "DEVELOPMENT") app.use(morgan("dev"));
if (ENV === "PRODUCTION") app.use(morgan("combined"));

// Parse incoming requests with JSON payloads
app.use(express.json());

// Health check route
app.get("/", (req, res) => res.json({ message: "UP" }));

// API routes
app.use("/api", routes);

// Global error handler
app.use(standardError);

// 404 route handler
app.all("*", (req, res) => res.status(404).json({ message: "Not Found" }));

if (ENV === "PRODUCTION") {
  // Update transactions task to run on server start
  updateTransactions();

  // fetch new transactions every 5 minutes
  const fiveMinutes = 300000;
  // const thirtySeconds = 30000;
  setInterval(() => {
    console.log("\n-------- Running task to update transactions --------");
    updateTransactions();
  }, fiveMinutes);
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("---- NODE EXITING ----: Terminating Node.js process");
  console.log("Closing database connection");

  try {
    await disconnect();
  } catch (err) {
    console.error("Database disconnection error");
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
});

module.exports = app;
