const seedTransactions = require("./transactions.seed");
const { connect, disconnect } = require("../config/db/connection");

const seed = async () => {
  try {
    await connect();
    await seedTransactions();
    await disconnect();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seed();
