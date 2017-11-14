const PublicResolver = require('./PublicResolver.js');
const DefaultReverseResolver = require('./DefaultReverseResolver');
const ReverseRegistrar = require('./ReverseRegistrar.js');
const FIFSRegistrar = require('./FIFSRegistrar');

const zeroAddr = '0x0000000000000000000000000000000000000000';

const namehash = (web3, name) => {
  let node = '0x0000000000000000000000000000000000000000000000000000000000000000';
  if (name !== '') {
    const labels = name.split('.');
    for (let i = labels.length - 1; i >= 0; i -= 1) {
      node = web3.utils.sha3(node + web3.utils.sha3(labels[i]).slice(2), { encoding: 'hex' });
    }
  }
  return node.toString();
};

const getAddr = async (ens, name) => {
  const node = namehash(ens.$web3, name);
  const resolverAddress = await ens.resolver(node);
  if (resolverAddress === zeroAddr) {
    return zeroAddr;
  }
  const resolver = new PublicResolver(ens.$web3, resolverAddress);
  const addr = await resolver.addr(node);
  return addr;
};

const setAddr = async (ens, name, addr) => {
  const web3 = ens.$web3;
  const node = namehash(web3, name);
  const resolverAddr = await ens.resolver(node);
  const resolver = new PublicResolver(web3, resolverAddr);

  await resolver.setAddr(node, addr);
};

const getContent = async (ens, name) => {
  const node = namehash(ens.$web3, name);
  const resolverAddress = await ens.resolver(node);
  if (resolverAddress === zeroAddr) {
    return zeroAddr;
  }
  const resolver = new PublicResolver(ens.$web3, resolverAddress);
  const content = await resolver.content(node);
  return content;
};

const setContent = async (ens, name, content) => {
  const web3 = ens.$web3;
  const node = namehash(web3, name);
  const resolverAddr = await ens.resolver(node);
  const resolver = new PublicResolver(web3, resolverAddr);

  await resolver.setContent(node, content);
};

const getName = async (ens, addr) => {
  let a = addr.toLowerCase();
  if (a.substr(0, 2) === '0x') a = a.substr(2);
  const domain = `${a}.addr.reverse`;
  const node = namehash(ens.$web3, domain);
  const resolverAddress = await ens.resolver(node);
  if (resolverAddress === zeroAddr) {
    return '';
  }
  const resolver = new DefaultReverseResolver(ens.$web3, resolverAddress);
  const name = resolver.name(node);
  return name;
};

const setName = async (ens, addr, name) => {
  const web3 = ens.$web3;
  const reverseRegistrarAddr = await ens.owner(namehash(web3, 'addr.reverse'));

  const reverseRegistrar = new ReverseRegistrar(web3, reverseRegistrarAddr);

  const defaultReverseResolverAddr = await getAddr(ens, 'resolver.eth');
  const defaultReverseResolver = new DefaultReverseResolver(web3, defaultReverseResolverAddr);

  await reverseRegistrar.claimWithResolver(
    addr,
    defaultReverseResolver.$address,
    { from: addr, gas: 200000 });

  let a = addr.toLowerCase();
  if (a.substr(0, 2) === '0x') a = a.substr(2);
  const node = namehash(web3, `${a}.addr.reverse`);

  await defaultReverseResolver.setName(
    node,
    name,
    { from: addr, gas: 200000 });
};

const claimEthDomain = async (ens, name, owner) => {
  const web3 = ens.$web3;
  const defaultResolverAddr = await getAddr(ens, 'resolver.eth');

  const ethRegistrarAddr = await ens.owner(namehash(web3, 'eth'));
  const ethRegistrar = new FIFSRegistrar(web3, ethRegistrarAddr);
  await ethRegistrar.register(
    web3.utils.sha3(name),
    owner,
    { from: owner, gas: 4000000 });

  await ens.setResolver(
    namehash(web3, `${name}.eth`),
    defaultResolverAddr,
    { from: owner, gas: 4000000 });
};

const setProxyInterface = async (ens, addr, iface, proxy) => {
  const web3 = ens.$web3;
  const reverseRegistrarAddr = await ens.owner(namehash(web3, 'addr.reverse'));

  const reverseRegistrar = new ReverseRegistrar(web3, reverseRegistrarAddr);

  const resolverAddr = await getAddr(ens, 'resolver.eth');
  const resolver = new PublicResolver(web3, resolverAddr);

  let a = addr.toLowerCase();
  if (a.substr(0, 2) === '0x') a = a.substr(2);

  const addrNode = namehash(web3, `${a}.addr.reverse`);
  const ownerAddr = await ens.owner(addrNode);

  if (ownerAddr !== addr) {
    await reverseRegistrar.claim(addr, { from: addr, gas: 200000 });
  }

  const ifaceNode = namehash(web3, `${iface}.${a}.addr.reverse`);
  const ownerIface = await ens.owner(ifaceNode);
  if (ownerIface !== addr) {
    await ens.setSubnodeOwner(
      addrNode,
      web3.utils.sha3(iface),
      addr,
      { from: addr, gas: 200000 });
  }

  const resolverIfaceAddr = await ens.resolver(ifaceNode);
  if (resolverIfaceAddr !== resolver.$address) {
    await ens.setResolver(
      ifaceNode,
      resolver.$address,
      { from: addr, gas: 200000 });
  }

  const currentProxyAddr = await resolver.addr(ifaceNode);
  if (currentProxyAddr !== proxy) {
    await resolver.setAddr(
      ifaceNode,
      proxy,
      { from: addr, gas: 200000 });
  }
};

const getProxyInterface = async (ens, addr, iface) => {
  let a = addr.toLowerCase();
  if (a.substr(0, 2) === '0x') a = a.substr(2);

  const proxy = await getAddr(ens, `${iface}.${a}.addr.reverse`);
  return proxy;
};

module.exports.claimEthDomain = claimEthDomain;
module.exports.namehash = namehash;
module.exports.getAddr = getAddr;
module.exports.setAddr = setAddr;
module.exports.getName = getName;
module.exports.setName = setName;
module.exports.getContent = getContent;
module.exports.setContent = setContent;
module.exports.getProxyInterface = getProxyInterface;
module.exports.setProxyInterface = setProxyInterface;
