const isValidDateFormat = require("../../../src/utils/isValidDateFormat");

describe("isValidDateFormat Utility Function", () => {
  test("returns true for a valid date format", () => {
    const validDate = "2023-01-01T01:01:01";
    expect(isValidDateFormat(validDate)).toBe(true);
  });

  test("returns false for an invalid date format", () => {
    const invalidDate = "2023/01/01 01:01:01";
    expect(isValidDateFormat(invalidDate)).toBe(false);
  });

  test("returns false for non-string input", () => {
    const nonStringInput = 123456;
    expect(isValidDateFormat(nonStringInput)).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isValidDateFormat("")).toBe(false);
  });

  test("returns false for null", () => {
    expect(isValidDateFormat(null)).toBe(false);
  });

  test("returns false for undefined", () => {
    expect(isValidDateFormat(undefined)).toBe(false);
  });
});
