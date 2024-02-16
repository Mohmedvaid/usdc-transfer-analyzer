const httpMocks = require("node-mocks-http");
const mongoose = require("mongoose");
const {
  validateGet,
  validateGetById,
  validateGetByAddress,
} = require("../../../src/validators/wallet");
const CustomError = require("../../../src/utils/CustomError");

describe("validateGet Validator", () => {
  // Helper function to create a request with query parameters
  const createRequest = (query) => httpMocks.createRequest({ query });

  const next = jest.fn();
  const res = httpMocks.createResponse();

  beforeEach(() => {
    next.mockClear();
  });

  test("validates with correct parameters", () => {
    const req = createRequest({
      start: "2023-01-01T00:00:00",
      end: "2023-01-02T00:00:00",
      mintransferred: "10",
      maxtransferred: "100",
      minreceived: "5",
      maxreceived: "50",
      limit: "10",
      page: "1",
    });

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  test.each([
    { field: "start", value: "invalid-date" },
    { field: "end", value: "invalid-date" },
  ])("returns error for invalid $field date format", ({ field, value }) => {
    const req = createRequest({ [field]: value });

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
  });

  test.each([
    { field: "mintransferred", value: "NaN" },
    { field: "maxtransferred", value: "NaN" },
    { field: "minreceived", value: "NaN" },
    { field: "maxreceived", value: "NaN" },
  ])("returns error for invalid $field number", ({ field, value }) => {
    const req = createRequest({ [field]: value });

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
  });

  test("returns error if start is missing when end is provided", () => {
    const req = createRequest({ end: "2023-01-01T00:00:00" });

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
  });

  test("returns error if start date is after end date", () => {
    const req = createRequest({
      start: "2023-01-02T00:00:00",
      end: "2023-01-01T00:00:00",
    });

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
  });

  test.each([
    { field: "limit", value: "0" },
    { field: "page", value: "0" },
  ])("returns error for invalid $field value", ({ field, value }) => {
    const req = createRequest({ [field]: value });

    validateGet(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
  });
});

describe("validateGetById Validator", () => {
  // Helper function to create a request with params
  const createRequest = (params) => httpMocks.createRequest({ params });

  const next = jest.fn();
  const res = httpMocks.createResponse();

  beforeEach(() => {
    next.mockClear();
  });

  test("validates with a valid mongoose ObjectId", () => {
    const req = createRequest({
      id: new mongoose.Types.ObjectId().toString(),
    });

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  test("returns error when id is missing", () => {
    const req = createRequest({});

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toBe("Invalid id");
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns error when id is not a string", () => {
    const req = createRequest({ id: 12345 });

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toBe("Invalid id");
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns error when id is an invalid mongoose ObjectId", () => {
    const req = createRequest({ id: "invalid-id" });

    validateGetById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toBe("Invalid id");
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });
});

describe("validateGetByAddress Validator", () => {
  // Helper function to create a request with params
  const createRequest = (params) => httpMocks.createRequest({ params });

  const next = jest.fn();
  const res = httpMocks.createResponse();

  beforeEach(() => {
    next.mockClear();
  });

  test("validates with a valid address", () => {
    const req = createRequest({ address: "0x1234567890123456789012345678901234567890" });

    validateGetByAddress(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  test("returns error when address is missing", () => {
    const req = createRequest({});

    validateGetByAddress(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toBe("Invalid address");
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns error when address is not a string", () => {
    const req = createRequest({ address: 12345 });

    validateGetByAddress(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toBe("Invalid address");
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });

  test("returns error when address is not a valid address", () => {
    const req = createRequest({ address: "invalid-address" });

    validateGetByAddress(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    expect(next.mock.calls[0][0].message).toBe("Invalid address");
    expect(next.mock.calls[0][0].statusCode).toBe(400);
  });
});
