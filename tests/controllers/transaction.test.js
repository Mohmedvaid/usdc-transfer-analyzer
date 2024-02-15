const request = require("supertest");
const app = require("../../src/app");

const getFormatedDate = (date) => {
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2); // Months are 0-based
  const day = `0${date.getDate()}`.slice(-2);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const seconds = `0${date.getSeconds()}`.slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

describe("Transaction Controller", () => {
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
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const startDate = getFormatedDate(yesterday);

      const today = new Date();
      const endDate = getFormatedDate(today);

      const response = await request(app).get("/api/transaction").query({
        start: startDate,
        end: endDate,
        limit: 10,
        page: 1,
      });

      const data = response.body.data;

      console.log(data.transactions[0]);
      expect(response.statusCode).toBe(200);
      expect(data).toHaveProperty("transactions");
      expect(data.transactions).toBeInstanceOf(Array);
      expect(data.transactions).toHaveLength(10);
      // add date validation video inserting test data
    });
  });

  // Tests for getById function
});
