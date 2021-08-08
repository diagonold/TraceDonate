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

-  Need to deploy to ganache network for testing
- Migrations are JavaScript files that help you deploy contracts to the Ethereum network. 
- truffle deploy and migrate does the same thing. its just alais
- These files are located in migrations folder
- To run migration run `truffle migrate --reset`



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
  3. Interact with a contract at a specific address
    - let specificInstance = await Project.at("0x1234...");
  - Here is a link on how to interact with smart contractshttps://www.trufflesuite.com/docs/truffle/getting-started/interacting-with-your-contracts


## Interacting with smart contracts on the browser with truffle
- Before you can interact with smart contracts in a browser, make sure they're compiled, deployed, and that you're interacting with them via web3 in client-side JavaScript. 
- Once the above task is done, MetaMask is the easiest way to interact with dapps in a browser.
- Not too sure on how we will use this yet. 


# To setup truffle and ganache
- This is for kai yu.
- These are the commands that i ran in order to create a project and access the summmary of that project.


1. Create a new workspace in ganache

2. In that workspace, link truffle project by adding the truffle-config.js.
- Once this is done, save workspace
- you can confirm that the workspace contains the correct contract by going to tracedonate contract and seeing 3 contracts which are migration, project and project hub

3. he command `truffle console` will allow you to interact with the contract in the ganache network

4. Make sure you have the latest solidity files. Now we compile the solidty files with in your terminal with command `truffle compile`

5. Now that we have the compiled bytecode, we send this to the ganache network with command `truffle deploy`

6. To create a projectHub instance , run the command `let hub = await ProjectHub.deployed()`

7. To create a new project with projectHub, run command `hub.create_project('this is project 1', 1, 1000)`

8. Find the address of the new project with command `hub.get_projects()`

9. With the above address we can create and instance of the new project. Run this command `let project1 = await Project.at(<above address>)`


let project1 = await Project.at('0xe10E310AD24720e94282366f47207947e7bcbF6e')
'0xe10E310AD24720e94282366f47207947e7bcbF6e'

10. lastly, call the get summary function with `project1.get_summary()`