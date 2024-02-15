const mongoose = require("mongoose");

/**
 * Function to validate Mongoose ObjectId.
 * @param {String} id - Mongoose ObjectId
 * @returns {Boolean} - True if valid, false otherwise
 */
const isValidMongooseId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = isValidMongooseId;
