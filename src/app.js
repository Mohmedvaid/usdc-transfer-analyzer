// src/app.js
require("dotenv").config();

// validateEnv.js - validate the required environment variables
require("./utils/validateEnv")();

// External imports
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// Local imports
const { ENV, PORT } = require("./config/app.config");
const corsOptions = require("./config/corsOptions");
const rateLimiter = require("./middleware/rateLimiter");
const credentials = require("./middleware/credentials");
const standardResponse = require("./middleware/standardRes");
const standardError = require("./middleware/standardErr");
const routes = require("./routes");
const { connect, disconnect } = require("./config/db/connection");

const app = express();

// Connect to the database
connect()
  .then(console.log("Database connected"))
  .catch((err) => {
    console.error("Database connection error");
    console.error(err);
    process.exit(1);
  });

// Rate limiting
app.use(rateLimiter);

// Global response handler
app.use(standardResponse);

if (ENV === "development") app.use(morgan("dev"));

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get("/", (req, res) => res.json({ message: "UP" }));

// API routes
app.use("/api", routes);

// Global error handler
app.use(standardError);

// Start the server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);

// 404 route handler
app.all("*", (req, res) => res.status(404).json({ message: "Not Found" }));

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
