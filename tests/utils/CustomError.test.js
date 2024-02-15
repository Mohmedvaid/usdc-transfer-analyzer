const CustomError = require("../../src/utils/CustomError");

describe("CustomError Class", () => {
  const defaultMessage = "Default Error";
  const defaultStatusCode = 400;

  test("should create an instance of CustomError with message and statusCode", () => {
    const error = new CustomError(defaultMessage, defaultStatusCode);
    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(defaultMessage);
    expect(error.statusCode).toBe(defaultStatusCode);
  });

  test("should have a date property", () => {
    const error = new CustomError(defaultMessage, defaultStatusCode);
    expect(error).toHaveProperty("date");
    expect(error.date).toBeInstanceOf(Date);
  });

  test("should maintain proper stack trace", () => {
    const error = new CustomError(defaultMessage, defaultStatusCode);
    expect(typeof error.stack).toBe("string");
  });

  test("should have a default status code of 400", () => {
    const error = new CustomError(defaultMessage);
    expect(error.statusCode).toBe(400);
  });
});
