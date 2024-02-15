const httpMocks = require("node-mocks-http");
const mongoose = require("mongoose");
const {
  validateGet,
  validateGetById,
} = require("../../src/validators/transaction");
const CustomError = require("../../src/utils/CustomError");

describe("validateGet Validator", () => {
  test("returns next with no arguments if req.query is empty", () => {
    const req = httpMocks.createRequest({ query: {} });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.query.limit).toBe(10);
    expect(req.query.page).toBe(1);
  });

  test("returns next with no arguments if req.query contains valid values", () => {
    const req = httpMocks.createRequest({ query: { limit: 10, page: 1 } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.query.limit).toBe(10);
    expect(req.query.page).toBe(1);
  });

  test("returns next with a CustomError if req.query contains invalid limit and page values", () => {
    const req = httpMocks.createRequest({
      query: { limit: "invalid", page: "invalid" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    // Check if next was called with a CustomError
    expect(next).toHaveBeenCalledWith(expect.any(CustomError));

    // Optionally, you can also check for specific properties of the error
    const customErrorInstance = next.mock.calls[0][0]; // Assuming the CustomError is the first argument passed to next()
    expect(customErrorInstance).toBeInstanceOf(CustomError);
    expect(customErrorInstance.message).toMatch(
      /Invalid limit value|Invalid page number/
    );
    expect(customErrorInstance.statusCode).toBe(400);
  });

  test("returns next with a CustomError if start or end date format is invalid", () => {
    const req = httpMocks.createRequest({
      query: { start: "invalid-date", end: "2023-12-31T00:00:00" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(/Invalid start time format/);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with a CustomError if min or max values are invalid", () => {
    const req = httpMocks.createRequest({
      query: { min: "not-a-number", max: "100" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(/Invalid min value/);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with a CustomError if start date is after end date", () => {
    const req = httpMocks.createRequest({
      query: {
        start: "2023-12-31T00:00:00",
        end: "2023-01-01T00:00:00",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(
      /Start time must be before end time/
    );
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with a CustomError if from or to address is invalid", () => {
    const req = httpMocks.createRequest({
      query: {
        from: "invalid-address",
        to: "0xD348C516d4Bff8Dbc5AbC6Df8EB1A07350Bba7F1",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(/Invalid from address/);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with a CustomError when end is provided without start", () => {
    const req = httpMocks.createRequest({
      query: { end: "2023-12-31T00:00:00" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(
      "Start time is required with end"
    );
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with a CustomError for non-string query parameters", () => {
    const req = httpMocks.createRequest({
      query: { limit: 10, page: { number: 1 } }, // `page` as an object instead of string
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    // Checking for type conversion issues or unexpected behaviors
    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
  });

  test("returns next with a CustomError for both invalid min and max values", () => {
    const req = httpMocks.createRequest({
      query: { min: "not-a-number", max: "also-not-a-number" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(
      /Invalid min value|Invalid max value/
    );
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with no arguments if all query parameters are valid", () => {
    const req = httpMocks.createRequest({
      query: {
        start: "2023-01-01T00:00:00",
        end: "2023-12-31T00:00:00",
        min: "10",
        max: "100",
        from: "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
        to: "0xD348C516d4Bff8Dbc5AbC6Df8EB1A07350Bba7F1",
        limit: "10",
        page: "1",
      },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith();
    expect(req.query).toEqual({
      start: new Date("2023-01-01T00:00:00"),
      end: new Date("2023-12-31T00:00:00"),
      min: mongoose.Types.Decimal128.fromString("10"),
      max: mongoose.Types.Decimal128.fromString("100"),
      from: "0xBF14DB80D9275FB721383a77C00Ae180fc40ae98",
      to: "0xD348C516d4Bff8Dbc5AbC6Df8EB1A07350Bba7F1",
      limit: 10,
      page: 1,
    });
  });
});

describe("validateGetById Validator", () => {
  test("returns next with a CustomError if id is not a string", () => {
    const req = httpMocks.createRequest({ params: { id: 123456 } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(/Invalid id/);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with a CustomError if id is not a valid mongoose id", () => {
    const req = httpMocks.createRequest({ params: { id: "invalid-id" } });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toMatch(/Invalid id/);
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns next with no arguments if id is a valid mongoose id", () => {
    const req = httpMocks.createRequest({
      params: { id: "5f3e1e8c1e5e2d1a5f3e1e8c" },
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  test("returns next with a CustomError if id is missing", () => {
    const req = httpMocks.createRequest({ params: {} });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toBe("Invalid id");
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });
});
