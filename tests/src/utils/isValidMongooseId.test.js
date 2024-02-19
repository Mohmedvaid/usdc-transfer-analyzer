const mongoose = require("mongoose");
const isValidMongooseId = require("../../../src/utils/isValidMongooseId");

describe("isValidMongooseId Utility Function", () => {
  test("returns true for a valid Mongoose ObjectId", () => {
    const validId = new mongoose.Types.ObjectId();
    expect(isValidMongooseId(validId.toString())).toBe(true);
  });

  test("returns false for an invalid Mongoose ObjectId", () => {
    const invalidId = "12345";
    expect(isValidMongooseId(invalidId)).toBe(false);
  });

  test("returns false for null", () => {
    expect(isValidMongooseId(null)).toBe(false);
  });

  test("returns false for undefined", () => {
    expect(isValidMongooseId(undefined)).toBe(false);
  });

  test("returns false for non-string input", () => {
    const nonStringInput = 123456;
    expect(isValidMongooseId(nonStringInput)).toBe(false);
  });

  test("returns false for an empty string", () => {
    expect(isValidMongooseId("")).toBe(false);
  });
});