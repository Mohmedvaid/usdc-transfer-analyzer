const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../src/app");
const dbSetup = require("../../setup/jest.setup");
const tearDown = require("../../setup/jest.teardown");

const testData = require("../../config/testdata.config");
const testTransactions = testData.transactions.items;
let seededTransaction;
let seededWallets;

describe("Transaction Controller", () => {
  beforeAll(async () => {
    const { savedTransactions, savedWallets } = await dbSetup();
    seededTransaction = savedTransactions;
    seededWallets = savedWallets;
  });

  afterAll(async () => {
    await tearDown();
  });

  describe("GET /api/transactions", () => {
    it("should return a paginated list of transactions", async () => {
      const response = await request(app).get("/api/transaction").query({
        limit: 10,
        page: 1,
      });
      // log the response
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty("transactions");
      expect(response.body.data.transactions).toBeInstanceOf(Array);
      expect(response.body.data).toHaveProperty("pagination");
      // Add more assertions as needed
    });

    it("should return transactions within a specified date range", async () => {
      // Use dates from test data
      const startDate = testTransactions[0].date;
      const endDate = testTransactions[0].date;

      const response = await request(app).get("/api/transaction").query({
        start: startDate,
        end: endDate,
        limit: 500,
        page: 1,
      });

      const transactions = response.body.data.transactions;

      expect(response.statusCode).toBe(200);
      expect(transactions).toBeInstanceOf(Array);
      expect(transactions).toHaveLength(testTransactions[0].qty);
    });

    it("should handle invalid date format for start and end", async () => {
      const response = await request(app).get("/api/transaction").query({
        start: "invalid-date",
        end: "invalid-date",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("should handle non-numeric min and max values", async () => {
      const response = await request(app).get("/api/transaction").query({
        min: "non-numeric",
        max: "non-numeric",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should handle invalid from and to addresses", async () => {
      const response = await request(app).get("/api/transaction").query({
        from: "invalid-address",
        to: "invalid-address",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should require start date when end date is provided", async () => {
      const response = await request(app)
        .get("/api/transaction")
        .query({ end: new Date().toISOString() });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should validate that start date is before end date", async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() - 86400000); // One day before start
      const response = await request(app).get("/api/transaction").query({
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should handle invalid limit and page values", async () => {
      const response = await request(app).get("/api/transaction").query({
        limit: -1,
        page: 0,
      });
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
    });

    it("should return an empty array if no transactions match the criteria", async () => {
      const response = await request(app).get("/api/transaction").query({
        start: "2020-01-01T00:00:00",
        end: "2020-01-01T01:00:00",
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.data.transactions).toHaveLength(0);
    });
  });

  // Tests for getById function
  describe("GET /api/transaction/:id", () => {
    it("should return a single transaction by id", async () => {
      const testId = seededTransaction[0]._id.toString();

      const response = await request(app).get(`/api/transaction/${testId}`);
      const resId = response.body.data._id;

      expect(response.statusCode).toBe(200);
      expect(resId).toBe(testId);
    });

    it("should return 404 for a non-existent wallet ID", async () => {
      const nonExistingId = new mongoose.Types.ObjectId().toString();

      const response = await request(app).get(
        `/api/transaction/${nonExistingId}`
      );
      expect(response.statusCode).toBe(404);
      expect(response.body.error).toBe(true);
    });

    it("should return 404 if transaction is not found", async () => {
      const response = await request(app).get("/api/transaction/invalid-id");
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe("Invalid id");
    });
  });
});
