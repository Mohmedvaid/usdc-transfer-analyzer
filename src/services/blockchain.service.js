const { Web3 } = require("web3");

const {
  AVALANCHE_NODE_URL,
  USDC_CONTRACT_ADDRESS,
} = require("../config/app.config");
const USDC_CONTRACT_ABI = require("../config/usdc.abi.json");

// Initialize web3 with Avalanche node
const web3 = new Web3(new Web3.providers.HttpProvider(AVALANCHE_NODE_URL));

// Create a USDC contract instance
const usdcContract = new web3.eth.Contract(
  USDC_CONTRACT_ABI,
  USDC_CONTRACT_ADDRESS
);

const MAX_BLOCKS_PER_QUERY = 2048; // Set a reasonable limit for testing

/**
 * Fetch USDC transfers.
 * @param {number} fromBlock - The starting block number to search for events.
 * @param {number} toBlock - The ending block number to search for events.
 * @returns {Promise<Array>} A promise that resolves with the list of transfer events.
 */
async function fetchUSDCtransfers() {
  let events = [];

  try {
    const latest = BigInt(await web3.eth.getBlockNumber());
    const fromBlock = latest - BigInt(1000);
    const toBlock = latest;

    const batchEvents = await usdcContract.getPastEvents("Transfer", {
      fromBlock,
      toBlock,
    });

    events = batchEvents.map((event) => {
      // Convert BigInt to String for JSON serialization
      const valueString = event.returnValues.value
        ? event.returnValues.value.toString()
        : "0";

      // Convert from Wei to USDC (or appropriate unit)
      const usdcValue = web3.utils.fromWei(valueString, "mwei"); // Adjust the unit as per the token's decimal precision

      return {
        from: event.returnValues.from,
        to: event.returnValues.to,
        value: usdcValue, // This is already a string
        blockNumber: event.blockNumber.toString(),
        transactionHash: event.transactionHash,
      };
    });

    return events;
  } catch (error) {
    console.error("Error fetching USDC transfers");
    throw error;
  }
}

module.exports = { fetchUSDCtransfers };
