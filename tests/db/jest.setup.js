// tests/jest.setup.js
require("dotenv").config();
const { connect } = require("../../src/config/db/connection");
const seedTransactions = require("../setup/seed");
const DB_URI = process.env.TEST_DB_URI;

module.exports = async () => {
  console.log = jest.fn();
  await connect(DB_URI);
  const transactions = await seedTransactions();
  global.__TEST_DATA__ = { transactions };
};
