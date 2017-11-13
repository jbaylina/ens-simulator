const ReverseRegistrarAbi = require('../build/ReverseRegistrar.sol').ReverseRegistrarAbi;
const ReverseRegistrarByteCode = require('../build/ReverseRegistrar.sol').ReverseRegistrarByteCode;
const generateClass = require('eth-contract-class').default;

module.exports = generateClass(ReverseRegistrarAbi, ReverseRegistrarByteCode);
