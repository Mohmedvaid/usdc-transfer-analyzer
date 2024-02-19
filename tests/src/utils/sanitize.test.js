const sanitize = require("../../../src/utils/sanitize");

describe("sanitize Utility Function", () => {
  test("should escape regex characters", () => {
    const input = "[{(*+?^$|})]";
    const output = "\\[\\{\\(\\*\\+\\?\\^\\$\\|\\}\\)\\]";
    expect(sanitize(input)).toBe(output);
  });

  test("should convert HTML special characters", () => {
    const input = "&<>\"'";
    const output = "&amp;&lt;&gt;&quot;&#039;";
    expect(sanitize(input)).toBe(output);
  });

  test("should return non-string input as is", () => {
    expect(sanitize(12345)).toBe(12345);
    expect(sanitize(null)).toBe(null);
    expect(sanitize(undefined)).toBe(undefined);
    expect(sanitize({ text: "Hello" })).toEqual({ text: "Hello" });
  });

  test("should handle empty strings", () => {
    expect(sanitize("")).toBe("");
  });

  test("should handle strings without dangerous characters", () => {
    const safeString = "Hello World";
    expect(sanitize(safeString)).toBe(safeString);
  });

  test("should escape characters that can lead to NoSQL injection or XSS", () => {
    const testString = "Hello { $ne: 1 }";
    const expected = "Hello \\{ \\$ne\\: 1 \\}";
    expect(sanitize(testString)).toBe(expected);
  });
});
