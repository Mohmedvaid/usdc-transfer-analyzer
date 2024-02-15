// src/services/transaction.service.js
const { USDC_CONTRACT_ADDRESS } = require("../config/app.config");
const USDC_CONTRACT_ABI = require("../config/usdc.abi.json");
const blockchainService = require("../config/web3.config");

class TransferService {
  constructor() {
    this.web3 = blockchainService;
    this.usdcContract = new this.web3.eth.Contract(
      USDC_CONTRACT_ABI,
      USDC_CONTRACT_ADDRESS
    );
  }

  async fetchUSDCtransfers(pageNumber = 1, pageSize = 100) {
    let events = [];
    try {
      const latest = BigInt(await this.web3.eth.getBlockNumber());

      // Validate and set maximum page size
      pageSize = pageSize > 2000 ? 2000 : pageSize;

      // Calculate fromBlock and toBlock based on page number
      const toBlock = latest - BigInt((pageNumber - 1) * pageSize);
      const fromBlock = toBlock - BigInt(pageSize);

      const batchEvents = await this.usdcContract.getPastEvents("Transfer", {
        fromBlock,
        toBlock,
      });

      events = batchEvents.map((event) => {
        const valueString = event.returnValues.value
          ? event.returnValues.value.toString()
          : "0";
        const usdcValue = this.web3.utils.fromWei(valueString, "mwei");
        return {
          from: event.returnValues.from,
          to: event.returnValues.to,
          value: usdcValue,
          blockNumber: event.blockNumber.toString(),
          transactionHash: event.transactionHash,
          transactionIndex: event.transactionIndex.toString(),
          blockHash: event.blockHash,
          logIndex: event.logIndex.toString(),
        };
      });

      return events;
    } catch (error) {
      console.error("Error fetching USDC transfers");
      throw error;
    }
  }
}

module.exports = new TransferService();
