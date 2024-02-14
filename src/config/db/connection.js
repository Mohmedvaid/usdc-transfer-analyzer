const mongoose = require("mongoose");
const { DB_URI: APP_DB_URI } = require("../app.config");

const connect = async (DB_URI) => {
  let databaseURI = DB_URI || APP_DB_URI;
  try {
    await mongoose.connect(databaseURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
  } catch (err) {
    console.error("Database connection error");
    throw err;
  }
};

const disconnect = async () => {
  try {
    await mongoose.connection.close();
    console.log("Database disconnected");
  } catch (err) {
    console.error("Database disconnection error");
    throw err;
  }
};

module.exports = { connect, disconnect };
