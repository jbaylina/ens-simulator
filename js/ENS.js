const ENSAbi = require('../build/ENS.sol').ENSAbi;
const ENSByteCode = require('../build/ENS.sol').ENSByteCode;
const generateClass = require('eth-contract-class').default;

module.exports = generateClass(ENSAbi, ENSByteCode);
