// src/services/blockchain.service.js
const { Web3 } = require("web3");
const { AVALANCHE_NODE_URL } = require("../config/app.config");

class BlockchainService {
  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider(AVALANCHE_NODE_URL));
  }

  getWeb3Instance() {
    return this.web3;
  }
}

module.exports = new BlockchainService();
