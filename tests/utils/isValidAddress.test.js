const isValidAddress = require("../../src/utils/isValidAddress"); // Adjust the path as needed

describe("isValidAddress Utility Function", () => {
  test("should return true for a valid Ethereum address", () => {
    const validAddress = "0x323b5d4c32345ced77393b3530b1eed0f346429d";
    expect(isValidAddress(validAddress)).toBe(true);
  });

  test("should return false for an invalid Ethereum address", () => {
    const invalidAddress = "0x123";
    expect(isValidAddress(invalidAddress)).toBe(false);
  });

  test("should return false for a non-string input", () => {
    const nonStringInput = 123456;
    expect(isValidAddress(nonStringInput)).toBe(false);
  });

  test("should return false for an empty string", () => {
    const emptyString = "";
    expect(isValidAddress(emptyString)).toBe(false);
  });
});
