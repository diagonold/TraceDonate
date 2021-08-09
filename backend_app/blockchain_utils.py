import json
from web3 import Web3
from models import *

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))
projectHub_address = '0x5caf2725Fe2cEDc132AbF7aB97cA6a7Caa8a5c42'


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
    logs = contract.events.ProjectCreated().processReceipt(tx_receipt)
    project_addy = logs[0]['args']['projectAddress']
    print(project_addy)
    return project_addy


def get_all_projects():
    abi = get_abi_from_json('../build/contracts/ProjectHub.json')
    contract = web3.eth.contract(address=projectHub_address, abi=abi)
    projects_ls = contract.functions.get_projects().call()
    return projects_ls


def get_project_requests(project_addy):
    abi = get_abi_from_json('../build/contracts/Project.json')
    contract = web3.eth.contract(address=project_addy, abi=abi)
    print(contract.functions.requests.call())
    return


def get_project_summary(project_addy):
    abi = get_abi_from_json('../build/contracts/Project.json')
    contract = web3.eth.contract(address=project_addy, abi=abi)
    project_details = contract.functions.get_summary().call()
    return project_details


def create_request(owner_addy, owner_key, project_addy, request_details):
    abi = get_abi_from_json('../build/contracts/Project.json')
    contract = web3.eth.contract(address=project_addy, abi=abi)
    nonce = web3.eth.getTransactionCount(owner_addy)
    txn = contract.functions.create_request(request_details, '0x7F963fFc88BE4513404d790206a50a19bf25c667',
                                            5).buildTransaction({
        'nonce': nonce
    })
    signed_txn = web3.eth.account.signTransaction(txn, private_key=owner_key)
    txn_hash = web3.eth.sendRawTransaction(signed_txn.rawTransaction)
    print(web3.toHex(txn_hash))


if __name__ == '__main__':
    ...
    # print(get_all_projects())
    #
    f = CreateProjectForm
    f.description = 'test'
    f.min_donation_amount = 1
    f.goal = 100
    #
    create_project('0xeF75AF9f3999e3BA5A0AdC46D9e7eD29d8D5f9A5',
                   'eac7e0ef8ec7424da7099bce12be2d0fcc1b2d813a1fede1f8cda437bd4ff921',
                   f)

    # contribute_to('0x3d6924A60Bd4548621FBdEE9E7367F548EC4C2ab',
    #               'e5cd5de6d951ca1afc8349f733db5ca4b71069b9ac0f63e2045b2b0a1ec8e6e1',
    #               '0xF320D4BbAE9F6143449FC409BF9F1154Ec868DEb',
    #               50)

    print(get_all_projects())

    # print(get_project_summary('0xF320D4BbAE9F6143449FC409BF9F1154Ec868DEb'))
    #
    # create_request('0xeF75AF9f3999e3BA5A0AdC46D9e7eD29d8D5f9A5',
    #                'eac7e0ef8ec7424da7099bce12be2d0fcc1b2d813a1fede1f8cda437bd4ff921',
    #                '0xF320D4BbAE9F6143449FC409BF9F1154Ec868DEb',
    #                'test-request')

    # abi = get_abi_from_json('../build/contracts/Project.json')
    # contract = web3.eth.contract(address='0xE21F654fd652A82521a67b440C2fe443da9bd967', abi=abi)
    # print(contract.functions.get_summary().call())
    # request_details = contract.functions.get_request_details(1).transact()
    # print(request_details)

    # contribute_to('0x7aFAEa96DDaB899748D65dD06b5607e5CeB71876',
    #              '09b597e6549cf30c7d2406020037ef88a5732e752e0e227f209e1c89b02fef2d',
    #              '0xE21F654fd652A82521a67b440C2fe443da9bd967',
    #              20)

    # print(web3.eth.getTransaction('0xd5f4c870704aa4a753aed104a0dcf7dded6c8c1a99aebfd5d0305ed36c88da3f'))

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
