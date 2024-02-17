const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../../src/app");
const dbSetup = require("../../setup/jest.setup");
const tearDown = require("../../setup/jest.teardown");

const testData = require("../../config/testdata.config");
const testTransactions = testData.transactions.items;
let seededTransaction;
let seededWallets;

describe("Wallet Controller", () => {
  beforeAll(async () => {
    const { savedTransactions, savedWallets } = await dbSetup();
    seededTransaction = savedTransactions;
    seededWallets = savedWallets;
  });

  afterAll(async () => {
    await tearDown();
  });

  describe("GET /api/wallet", () => {
    it("should return a paginated list of wallets", async () => {
      const response = await request(app).get("/api/wallet").query({
        limit: 10,
        page: 1,
      });
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty("wallets");
      expect(response.body.data.wallets).toBeInstanceOf(Array);
      expect(response.body.data).toHaveProperty("pagination");
    });

    it("should handle invalid date format for start and end", async () => {
      const response = await request(app).get("/api/wallet").query({
        start: "invalid-date",
        end: "invalid-date",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("should handle non-numeric min and max values", async () => {
      const response = await request(app).get("/api/wallet").query({
        mintransferred: "invalid-value",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("should handle non-numeric min and max values", async () => {
      const response = await request(app).get("/api/wallet").query({
        minreceived: "invalid-value",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("should handle non-numeric min and max values", async () => {
      const response = await request(app).get("/api/wallet").query({
        maxtransferred: "invalid-value",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("should handle non-numeric min and max values", async () => {
      const response = await request(app).get("/api/wallet").query({
        maxreceived: "invalid-value",
      });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });

    it("should require start date when end date is provided", async () => {
      const response = await request(app)
        .get("/api/wallet")
        .query({ end: new Date().toISOString() });
      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe(true);
    });
  });

  describe("GET /api/wallet/:id", () => {
    it("should return a single wallet by id", async () => {
      const testId = seededWallets[0].sender._id.toString();

      const response = await request(app).get(`/api/wallet/${testId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty("_id", testId);
      // todo add validation for tansactions matching wallet
    });

    it("should validate the returned wallet data structure", async () => {
      const testWalletId = seededWallets[0].sender._id.toString();

      const response = await request(app).get(`/api/wallet/${testWalletId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty("address");
      expect(response.body.data).toHaveProperty("totalTransferred");
      expect(response.body.data).toHaveProperty("totalReceived");
      expect(response.body.data).toHaveProperty("totalTransactionCount");
      // Add more validations as needed
    });

    it("should return a wallet by its address", async () => {
      const testWalletAddress = seededWallets[0].sender.address;

      const response = await request(app).get(
        `/api/wallet/address/${testWalletAddress}`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty("address", testWalletAddress);
      // Validate other properties as necessary
    });

    it("should return 404 for a non-existent wallet ID", async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app).get(`/api/wallet/${nonExistentId}`);
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty("error", true);
      // Validate error message if applicable
    });

    it("should return 400 if wallet id is invalid", async () => {
      const response = await request(app).get("/api/wallet/invalid-id");
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(true);
    });
  });

  describe("GET /api/wallet/address/:address", () => {
    it("should return a wallet by address", async () => {
      const validAddress = seededWallets[0].sender.address;

      const response = await request(app).get(
        `/api/wallet/address/${validAddress}`
      );
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toHaveProperty("address", validAddress);
    });

    it("should return 400 if wallet address is invalid", async () => {
      const response = await request(app).get(
        "/api/wallet/address/invalid-address"
      );
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(true);
    });
  });
});
