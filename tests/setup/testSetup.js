require("dotenv").config();
const mongoose = require("mongoose");
const { connect, disconnect } = require("../../src/config/db/connection");
const seedTransactions = require("../setup/seed");
const DB_URI = process.env.TEST_DB_URI;

afterAll(async () => {
  console.log = originalLog;

  console.log("Dropping the database...");
  await mongoose.connection.db.dropDatabase();

  console.log("Disconnecting from the database...");
  await disconnect();
});
