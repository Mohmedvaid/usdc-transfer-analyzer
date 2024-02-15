const validator = require("web3-validator");

/**
 * Function to validate Ethereum address.
 * @param {String} address - Ethereum address
 * @returns {Boolean} - True if valid, false otherwise
 */
const isValidAddress = (address) => validator.isAddress(address);

module.exports = isValidAddress;
