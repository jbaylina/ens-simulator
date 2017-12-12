# ENS-Simulator

Deploys a full ENS system in a test envirotment.

This package is very usefull to test smart contracts that depends on ens.

## DEPLOYMENT

Please do not use this script in mainnet. You may lose one ETH.

The deployment process will create an account with a known deterministic private key.
The script will send 1ETH to that account and will deploy the contract using that key.
So the address of the ENS that will be created at: 0x8cDE56336E289c028C8f7CF5c20283fF02272182


To deploy it
```
    npm install
```

Start testrpc In another console.
Be sure to use the included version of testrpc, the current version does not implement
`personal_importRawKey` yet.

```
    node ./node_modules/ethereumjsestrpc/build/cli.node.js
```

Deploy the Ens system
```
    node ./deploy.js
```







