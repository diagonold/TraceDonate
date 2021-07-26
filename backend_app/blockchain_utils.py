from web3 import Web3

infura_url = "https://mainnet.infura.io/v3/58ab3aef0dc54f488ee23c9afd8fbe4c"
web3 = Web3(Web3.HTTPProvider(infura_url))
print(web3.isConnected())
print(web3.eth.blockNumber)


balance = web3.eth.getBalance("0x90e63c3d53E0Ea496845b7a03ec7548B70014A91")
print(balance)
