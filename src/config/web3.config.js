// src/config/web3.config.js
const { Web3 } = require("web3");
const { AVALANCHE_NODE_URL } = require("./app.config");

const BlockChain = new Web3(
  new Web3.providers.HttpProvider(AVALANCHE_NODE_URL)
);

module.exports = BlockChain;
