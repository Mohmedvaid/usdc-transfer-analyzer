const request = require("supertest");
const app = require("../../../src/app");
const testData = require("../../config/testdata.config");
const dbSetup = require("../../db/jest.setup");
const tearDown = require("../../db/jest.teardown");
const testItems = testData.transactions.items;

describe("Transaction Controller", () => {
  beforeAll(async () => {
    await dbSetup();
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
      const startDate = testItems[0].date;
      const endDate = testItems[0].date;

      const response = await request(app).get("/api/transaction").query({
        start: startDate,
        end: endDate,
        limit: 500,
        page: 1,
      });

      const transactions = response.body.data.transactions;

      expect(response.statusCode).toBe(200);
      expect(transactions).toBeInstanceOf(Array);
      expect(transactions).toHaveLength(testItems[0].qty);
    });
  });

  // Tests for getById function
});
