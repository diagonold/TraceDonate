# TraceDonate


## Truffle
- Developmental framework for ethereum. Install using node
- Run this command 'npm install truffle -g'
- Create a new project with truffle.init

## Metamask
- Add metamask extension on chrome

## Truffle and metamask


## Ganache
- Ganache gives us environment for local blockchain with using truffle commands we can communicate with ganache.
- Install from here https://www.trufflesuite.com/ganache


# Project Details

## Project structure

1. contracts/: Directory for Solidity contracts
2. migrations/: Directory for scriptable deployment files
3. test/: Directory for test files for testing your application and contracts
4. truffle-config.js: Truffle configuration file

## To compile

- `truffle compile`

## Migrations

- Migrations are JavaScript files that help you deploy contracts to the Ethereum network. 
- These files are located in migrations folder
- To run migration run `truffle migrate`

## Interacting with your smart contracts
- When testing your code, it is best to interact with smart contract using remix
- When launching smart contract on a local blockchain, we use truffle.
- In general, writing data is called a transaction whereas reading data is called a call
- Reasons to use Truffle Console:
  - You have a client you're already using, such as Ganache or geth
  - You want to migrate to a testnet (or the main Ethereum network)
  - You want to use a specific mnemonic or account list

- To run truffle console, run command `truffle console`
- With this console, we can interact with the contract
- This can be useful when writing the script of web.js or web.py that interacts with the contract

  1. Create a projectHub instance 
    - let instance = await ProjectHub.deployed()
  2. Execute contract funcitons like:
    - instance.get_projects()


## Interacting with smart contracts on the browser with truffle and metamask
- Before you can interact with smart contracts in a browser, make sure they're compiled, deployed, and that you're interacting with them via web3 in client-side JavaScript. 
- Once the above task is done, MetaMask is the easiest way to interact with dapps in a browser.
- Not too sure on how we will use this yet. 









