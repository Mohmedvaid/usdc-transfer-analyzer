const mongoose = require("mongoose");

const isValidMongooseId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = isValidMongooseId;
