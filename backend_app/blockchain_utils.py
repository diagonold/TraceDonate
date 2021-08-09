import json
from web3 import Web3
from models import *

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
projectHub_address = '0xa875708442458BE3635d4Bc928474a5Ed6Be02Ac'


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


# This is hard to do!
def get_transaction(account_addy):
    ...


def get_balance(account_addy):
    balance = web3.eth.getBalance(account_addy)
    balance_in_ether = web3.fromWei(balance, "ether")
    print(balance_in_ether)
    return balance_in_ether


def get_abi_from_json(json_path):
    with open(json_path) as file:
        return json.load(file)['abi']


def contribute_to(from_addy, from_key, to_addy, amount):
    abi = get_abi_from_json('../build/contracts/Project.json')
    contract = web3.eth.contract(address=to_addy, abi=abi)
    nonce = web3.eth.getTransactionCount(from_addy)
    # TODO check amount <= balance
    txn = contract.functions.contribute().buildTransaction({
        'gas': 100000,
        'gasPrice': web3.toWei('1', 'gwei'),
        'nonce': nonce,
        'value': web3.toWei(amount, 'ether'),
    })
    signed_txn = web3.eth.account.signTransaction(txn, private_key=from_key)
    txn_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    # TODO Store Transaction hash
    print(web3.toHex(txn_hash))


def create_project(from_addy, from_key, create_project_form: CreateProjectForm):
    abi = get_abi_from_json('../build/contracts/ProjectHub.json')
    contract = web3.eth.contract(address=projectHub_address, abi=abi)
    nonce = web3.eth.getTransactionCount(from_addy)
    txn = contract.functions.create_project(create_project_form.description,
                                            create_project_form.min_donation_amount,
                                            create_project_form.goal).buildTransaction({'nonce': nonce})
    signed_txn = web3.eth.account.signTransaction(txn, private_key=from_key)
    txn_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)

    tx_receipt = web3.eth.waitForTransactionReceipt(txn_hash)
    # # # Create the contract instance with the newly-deployed address
    # contract = web3.eth.contract(
    #     address=tx_receipt.contractAddress,
    #     abi=abi,
    # )
    print(tx_receipt.contractAddress)
    print(web3.toHex(txn_hash))
    return

def get_all_projects():
    abi = get_abi_from_json('../build/contracts/ProjectHub.json')
    contract = web3.eth.contract(address=projectHub_address, abi=abi)
    projects_ls = contract.functions.get_projects().call()
    return projects_ls


def get_project_details(project_addy):
    abi = get_abi_from_json('../build/contracts/Project.json')
    contract = web3.eth.contract(address=project_addy, abi=abi)
    project_details = contract.functions.get_summary().call()
    return project_details


def create_request(owner_addy, owner_key, request_details):
    abi = get_abi_from_json('../build/contracts/Project.json')
    contract = web3.eth.contract(address=owner_addy, abi=abi)
    nonce = web3.eth.getTransactionCount(owner_addy)
    txn = contract.functions.create_request(request_details, '0xe942dEa825c2B401830F1DfD6994C8849F062954', 100).buildTransaction({
        'nonce': nonce
    })
    signed_txn = web3.eth.account.signTransaction(txn, private_key=owner_key)
    txn_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    print(txn_hash)


if __name__ == '__main__':
    ...
    wallet = '0x7e5cd0cF4A9fD488195421841f014188dA498a7c'
    key = '8c05f73f8c628011405e8894344285c15bf8ee79d951c1c32833abdd1ccdefda'
    print(get_all_projects())

    form = CreateProjectForm
    form.description = 'testing'
    form.min_donation_amount = 10
    form.goal = 100

    print(create_project(wallet, key, form))
    print(get_all_projects())


    # contribute_to(
    #     '0x7aFAEa96DDaB899748D65dD06b5607e5CeB71876',
    #     '09b597e6549cf30c7d2406020037ef88a5732e752e0e227f209e1c89b02fef2d',
    #     '0x683C09EE0342c377B77a47bf7F49E86Dc70702cb',
    #     1
    # )

    # a = web3.eth.getTransaction('0x275c1f1a3d8fea247bde235a613d3cbf30d806efe81418fc9fc4b7e24d8857bc')
    #
    # print(a)
    #
    # b = web3.eth.fil(
    #     {'fromBlock': 'earliest', 'toBlock': 'latest', 'address': '0x7aFAEa96DDaB899748D65dD06b5607e5CeB71876'})
    # print(web3.eth.get_filter_logs(b.filter_id))
    # print(b)

    # OMG Address
    # create_project('0xe942dEa825c2B401830F1DfD6994C8849F062954',
    #                '7cd2bbcce263805a980b19a4da65d3c6567b477420bd86e0556678e4b28924fc',
    #                '0x5dDbe75893e5429a26efdb8681b20BB4d59c9c1B',
    #                'testing 666'
    #                )
    # breakpoint()
    # with open('../build/contracts/ProjectHub.json') as f:
    #     contract_json = json.load(f)
    #     abi = contract_json['abi']
    #
    # address = '0x5dDbe75893e5429a26efdb8681b20BB4d59c9c1B'
    # contract = web3.eth.contract(address=address, abi=abi)
    # # print(contract.functions.create_project("test1", 10, 1000).transact())
    # print(contract.functions.get_projects().call())

    # wallet = '0x7F963fFc88BE4513404d790206a50a19bf25c667'
    # key = 'd3f8ca75e732d908440ab56b7289edb05dddb70225efc89dee5d83bc94c2b4ec'
    #
    # contract_addy = '0x3B3F14e5FE197A970b14406551fDB22b47E38c41'
    #
    # # nonce = web3.eth.getTransactionCount(wallet)
    # # tx = {
    # #     'nonce': nonce,
    # #     'to': contract_addy,
    # #     'value': web3.toWei(66, 'ether'),
    # #     'gas': 2000000,
    # #     'gasPrice': web3.toWei('1', 'gwei'),
    # # }
    # #
    # # signed_tx = web3.eth.account.signTransaction(tx, key)
    # # tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    # # print(web3.toHex(tx_hash))
    # # web3.eth.defaultAccount = wallet
    # with open('../build/contracts/Project.json') as f:
    #     contract_json = json.load(f)
    #     abi = contract_json['abi']
    #     byte_code = contract_json['bytecode']
    #
    # contract = web3.eth.contract(address=contract_addy, abi=abi)
    # print(contract.functions.get_summary().call())

    # nonce = web3.eth.getTransactionCount(wallet)
    # txn = contract.functions.contribute().buildTransaction({
    #     'gas': 100000,
    #     'gasPrice': web3.toWei('1', 'gwei'),
    #     'nonce': nonce,
    #     'value': web3.toWei(16, 'ether'),
    # })
    # signed_txn = web3.eth.account.signTransaction(txn, private_key=key)
    # result = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    # print(result)

    # contract.functions.contribute().transact(
    #     {'from': wallet, 'value': web3.toWei(2, 'ether')}
    # )

    # print(contract.functions.get_summary().call())
    #
    # balance = web3.eth.getBalance(contract_addy)
    # print(web3.fromWei(balance, "ether"))
