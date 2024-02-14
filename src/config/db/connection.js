const mongoose = require("mongoose");
const { DB_URI: APP_DB_URI } = require("../app.config");

/**
 * Establishes a connection to the MongoDB database.
 *
 * @param {string} [DB_URI] - The URI of the database to connect to. If not provided, the default URI from the app configuration is used.
 * @throws {Error} Throws an error if the database connection fails.
 */
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

/**
 * Closes the connection to the MongoDB database.
 *
 * @throws {Error} Throws an error if the database disconnection fails.
 */
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
