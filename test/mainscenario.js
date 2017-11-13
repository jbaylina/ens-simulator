/* eslint-env mocha */
/* eslint-disable no-await-in-loop */
const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const chai = require('chai');

const ensSimulator = require('../index.js');
const getAddr = require('../js/enstools').getAddr;
const getName = require('../js/enstools').getName;
const setAddr = require('../js/enstools').setAddr;
const setName = require('../js/enstools').setName;
const getContent = require('../js/enstools').getContent;
const setContent = require('../js/enstools').setContent;
const claimEthDomain = require('../js/enstools').claimEthDomain;

const assert = chai.assert;
const { utils } = Web3;

const verbose = false;

const log = (S) => {
  if (verbose) {
    console.log(S);
  }
};


describe('ENS Simulator', () => {
  let testrpc;
  let accounts;
  let web3;
  let ens;

  before(async () => {
    testrpc = TestRPC.server({
      ws: true,
      gasLimit: 5800000,
      total_accounts: 10,
    });

    testrpc.listen(8546, '127.0.0.1');

    web3 = new Web3('ws://localhost:8546');
    accounts = await web3.eth.getAccounts();
  });

  after((done) => {
    testrpc.close();
    done();
  });

  it('should deploy all the contracts', async () => {
    ens = await ensSimulator.deployENSSimulator(web3);
    assert.ok(ens.$address);
  }).timeout(8000);


  it('should register an address for a domain', async () => {
    await claimEthDomain(ens, 'example', accounts[0]);
    await setAddr(ens, 'example.eth', accounts[0]);

    const addr = await getAddr(ens, 'example.eth');

    assert.equal(addr, accounts[0]);
  }).timeout(8000);

  it('should register a content for a domain', async () => {
    await setContent(ens, 'example.eth', web3.utils.sha3('MyWeb'));

    const content = await getContent(ens, 'example.eth');

    assert.equal(content, web3.utils.sha3('MyWeb'));
  }).timeout(8000);

  it('should register a reverse ens', async () => {
    await setName(ens, accounts[0], 'example.eth');

    const name = await getName(ens, accounts[0]);

    assert.equal(name, 'example.eth');
  }).timeout(8000);
});
