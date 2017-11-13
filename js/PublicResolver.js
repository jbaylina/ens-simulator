const PublicResolverAbi = require('../build/PublicResolver.sol').PublicResolverAbi;
const PublicResolverByteCode = require('../build/PublicResolver.sol').PublicResolverByteCode;
const generateClass = require('eth-contract-class').default;

module.exports = generateClass(PublicResolverAbi, PublicResolverByteCode);
