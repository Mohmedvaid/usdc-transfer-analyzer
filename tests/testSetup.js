require("dotenv").config();
const mongoose = require("mongoose");
const { connect, disconnect } = require("../src/config/db/connection");
const seedTransactions = require("../src/seeders/transactions.seed");
const DB_URI = process.env.TEST_DB_URI;

let originalLog;

beforeAll(async () => {
  console.log("Connecting to the database...");
  await connect(DB_URI);

  console.log("Seeding the database with transactions...");

  originalLog = console.log;
  // console.log = jest.fn();

  await seedTransactions();
});

afterAll(async () => {
  console.log = originalLog;

  console.log("Dropping the database...");
  await mongoose.connection.db.dropDatabase();

  console.log("Disconnecting from the database...");
  await disconnect();
});
