import json
from web3 import Web3

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))


def create_account():
    new_acct = web3.eth.account.create()
    return {'address': new_acct.address,
            'key': new_acct.key.hex()
            }


def send_payment(from_addy, from_key, to_addy, amount):
    nonce = web3.eth.getTransactionCount(from_addy)

    tx = {
        'nonce': nonce,
        'to': to_addy,
        'value': web3.toWei(amount, 'ether'),
        'gas': 2000000,
        'gasPrice': web3.toWei('50', 'gwei'),
    }
    signed_tx = web3.eth.account.signTransaction(tx, from_key)
    tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    print(web3.toHex(tx_hash))


def get_transaction(account_addy):
    ...


def get_balance(account_addy):
    balance = web3.eth.getBalance(account_addy)
    balance_in_ether = web3.fromWei(balance, "ether")
    print(balance_in_ether)
    return balance_in_ether


def read_file(file_path):
    with open(file_path, 'r') as f:
        return f.read()


if __name__ == '__main__':
    ...
    # OMG Address
    # with open('../build/contracts/ProjectHub.json') as f:
    #     contract_json = json.load(f)
    #     abi = contract_json['abi']
    #     byte_code = contract_json['bytecode']
    #     print(abi)
    #     print(byte_code)
    # address = '0xcAc1211C7a4320beA3fb6309AF42Ae21Cb1FBa09'
    # contract = web3.eth.contract(address=address, abi=abi)
    # print(contract.functions.create_project("test1", 10, 1000).call())
    # print(contract.functions.get_projects().call())
