const mongoose = require("mongoose");
const { disconnect } = require("../../src/config/db/connection");
module.exports = async () => {
  console.log("Dropping the database...");
  await mongoose.connection.db.dropDatabase();

  console.log("Disconnecting from the database...");
  await disconnect();
};
