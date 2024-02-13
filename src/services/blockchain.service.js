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

/**
 * Fetch USDC transfers.
 * @param {number} fromBlock - The starting block number to search for events.
 * @param {number} toBlock - The ending block number to search for events.
 * @returns {Promise<Array>} A promise that resolves with the list of transfer events.
 */
async function fetchUSDCtransfers() {
  const MAX_BLOCKS_PER_QUERY = 2048; // Set a reasonable limit for testing
  let events = [];

  // For testing, hardcode a specific range known to contain USDC transfer events
  let fromBlock = 1000000; // Example start block
  let toBlock = fromBlock + MAX_BLOCKS_PER_QUERY; // Example end block

  try {
    const batchEvents = await usdcContract.getPastEvents("Transfer", {
      fromBlock,
      toBlock,
    });

    console.log(batchEvents);

    events = batchEvents.map((event) => ({
      from: event.returnValues._from,
      to: event.returnValues._to,
      value: web3.utils.fromWei(event.returnValues._value, "ether"),
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
    }));

    return events;
  } catch (error) {
    console.error("Error fetching USDC transfers:", error);
    throw error;
  }
}

module.exports = { fetchUSDCtransfers };
