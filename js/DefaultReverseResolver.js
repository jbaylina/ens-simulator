const DefaultReverseResolverAbi = require('../build/ReverseRegistrar.sol').DefaultReverseResolverAbi;
const DefaultReverseResolverByteCode = require('../build/ReverseRegistrar.sol').DefaultReverseResolverByteCode;
const generateClass = require('eth-contract-class').default;

module.exports = generateClass(DefaultReverseResolverAbi, DefaultReverseResolverByteCode);
