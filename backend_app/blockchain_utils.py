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


if __name__ == '__main__':
    # send_payment('0xB4367A219ec30964EefE70F566e55f056EBef110',
    #              'c1c0ba97e56a3a2dd575927ddb6601b02b52f07d39880ca4b2b23830acb71ba2',
    #              '0xc39Bba04F774b825bE5060bf28645CD82AC29bA4', 10)
    balance = web3.eth.getBalance("0xc39Bba04F774b825bE5060bf28645CD82AC29bA4")
    print(web3.fromWei(balance, "ether"))
    print()


# accounts = web3.eth.get_accounts()
# print(accounts)
# print(len(accounts))
# for i in accounts:
#     print(i)
#
# print('>>>>>>>>>>>>>>>>')
# create_account()

# project_hub_contract_address = '0xd7b294349E8c22555a384F0eE8a3e8D53237001D'
# def read_content_from(file_path):
#     with open(file_path, 'r') as f:
#         content = f.read()
#         return content
#
#
# projectHub_abi = json.loads(read_content_from('projectHub_abi.json'))
# project_abi = json.loads(read_content_from('projectHub_abi.json'))
#
# projectHub = web3.eth.contract(address=project_hub_contract_address, abi=projectHub_abi)
# projects = projectHub.functions.create_project("test", 100, 100000)
# print(projects)
