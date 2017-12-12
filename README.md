# ENS-Simulator

Deploys a full ENS system in a test envirotment.

This package is very usefull to test smart contracts that depends on ens.

## DEPLOYMENT

Please do not use this script in mainnet. You may lose one ETH.

The deployment process will create an account with a fixed prived key.
Will send 1ETH to that account and will deploy the contract using that key.
So the address of the ENS that will be created at: 0x8cDE56336E289c028C8f7CF5c20283fF02272182

The testrpc needs `personal_importRawKey` implementation so please use this for here:

To deploy it
```
    npm install
```

Start testrpc In another console (Special fork that implements `personal_importRawKey` )
```
    node ./node_modules/ethereumjsestrpc/build/cli.node.js
```

Deploy the Ens system
```
    node ./deploy.js
```







