const Web3 = require('web3');
const ensSimulator = require('./index.js');

const web3 = new Web3('http://localhost:8545');

ensSimulator.deployENSSimulator(web3).then((ens) => {
  console.log('EnsAddress: ', ens.$address);
}).catch((err) => {
  console.log('ERROR: ', err);
});

