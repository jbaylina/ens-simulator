const FIFSRegistrarAbi = require('../build/FIFSRegistrar.sol').FIFSRegistrarAbi;
const FIFSRegistrarByteCode = require('../build/FIFSRegistrar.sol').FIFSRegistrarByteCode;
const generateClass = require('eth-contract-class').default;

module.exports = generateClass(FIFSRegistrarAbi, FIFSRegistrarByteCode);
