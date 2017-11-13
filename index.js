const ENS = require('./js/ENS.js');
const FIFSRegistrar = require('./js/FIFSRegistrar');
const DefaultReverseResolver = require('./js/DefaultReverseResolver');
const ReverseRegistrar = require('./js/ReverseRegistrar');
const PublicResolver = require('./js/PublicResolver.js');
const enstools = require('./js/enstools');

const rawKey = '0x0123456789012345678901234567890123456789012345678901234567890123';
const zero = '0x0000000000000000000000000000000000000000000000000000000000000000';

module.exports.claimEthDomain = enstools.claimEthDomain;
module.exports.namehash = enstools.namehash;
module.exports.getAddr = enstools.getAddr;
module.exports.setAddr = enstools.setAddr;
module.exports.getName = enstools.getName;
module.exports.setName = enstools.setName;
module.exports.getContent = enstools.getContent;
module.exports.setContent = enstools.setContent;

const namehash = enstools.namehash;

module.exports.deployENSSimulator = async (web3) => {
  const deployAccount = web3.eth.accounts.privateKeyToAccount(rawKey);
  const accounts = await web3.eth.getAccounts();

  await web3.eth.sendTransaction({
    from: accounts[0],
    to: deployAccount.address,
    value: web3.utils.toWei(1),
  });

  await web3.eth.personal.importRawKey(rawKey, '');
  await web3.eth.personal.unlockAccount(deployAccount.address, '', 86400);

  const ens = await ENS.new(
    web3,
    { from: deployAccount.address, gas: 4000000 });

  const ethRegistrar = await FIFSRegistrar.new(
    web3,
    ens.$address,
    namehash(web3, 'eth'),
    { from: deployAccount.address, gas: 4000000 });

  await ens.setSubnodeOwner(
    zero, web3.utils.sha3('eth'),
    ethRegistrar.$address,
    { from: deployAccount.address, gas: 4000000 });

  const publicResolver = await PublicResolver.new(
    web3,
    ens.$address,
    { from: deployAccount.address, gas: 4000000 });

  await ethRegistrar.register(
    web3.utils.sha3('resolver'),
    deployAccount.address,
    { from: deployAccount.address, gas: 4000000 });

  await ens.setResolver(
    namehash(web3, 'resolver.eth'),
    publicResolver.$address,
    { from: deployAccount.address, gas: 4000000 });

  await publicResolver.setAddr(
    namehash(web3, 'resolver.eth'),
    publicResolver.$address,
    { from: deployAccount.address, gas: 4000000 });

  const reverseRegistrar = await FIFSRegistrar.new(
    web3,
    ens.$address,
    namehash(web3, 'reverse'),
    { from: deployAccount.address, gas: 4000000 });

  await ens.setSubnodeOwner(
    zero,
    web3.utils.sha3('reverse'),
    reverseRegistrar.$address,
    { from: deployAccount.address, gas: 4000000 });

  const defaultReverseResolver = await DefaultReverseResolver.new(
    web3,
    ens.$address,
    { from: deployAccount.address, gas: 4000000 });

  const addrReverseRegistrar = await ReverseRegistrar.new(
    web3,
    ens.$address,
    defaultReverseResolver.$address,
    { from: deployAccount.address, gas: 4000000 });

  await reverseRegistrar.register(
    web3.utils.sha3('addr'),
    addrReverseRegistrar.$address,
    { from: deployAccount.address, gas: 4000000 });

  return ens;
};

