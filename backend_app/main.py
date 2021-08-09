import uvicorn
import random, string, uuid, traceback

from fastapi import FastAPI, status, Security
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

from models import *
import database_utils as database_utils
from auth import Auth
import blockchain_utils as blockchain_utils

app = FastAPI()
security = HTTPBearer()
auth_handler = Auth()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def random_str(length=32):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


@app.get("/api")
def root():
    return {"msg": "Blockchain Project API"}


@app.post("/api/register", status_code=201, responses={
    500: {"description": "Username exists / Server Error"}
})
def register(register_form: CredentialsForm):
    try:
        if database_utils.user_exist(register_form.username):
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                content={"msg": "The username already exists"})
        else:
            hashed_password = auth_handler.encode_password(register_form.password)
            account = blockchain_utils.create_account()
            database_utils.create_user(register_form.username, hashed_password, account['address'], account['key'])
    except Exception as err:
        print(err)
        traceback.print_exc()
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"msg": "Fail to register"})


@app.post("/api/login", status_code=201, responses={
    401: {"description": "Invalid Username/ Password"},
    500: {"description": "Server Error"}
})
def login(login_form: CredentialsForm):
    try:
        user = database_utils.get_user(login_form.username)
        if user is None:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid username"})
        if not auth_handler.verify_password(login_form.password, user['password']):
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid password"})
        token = auth_handler.encode_token(user)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"token": token, "username": user['username']})
    except Exception as err:
        print(err)
        traceback.print_exc()
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"msg": "Fail to login"})


@app.get("/api/wallets", status_code=200, responses={
    401: {"description": "Invalid Token"}})
def wallets(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user = auth_handler.decode_token(token)
        wallet = user['wallet']
        balance = blockchain_utils.get_balance(wallet)
        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"wallet": wallet, "balance": "%s" % balance})
        # return JSONResponse(status_code=status.HTTP_200_OK,
        #                     content={"wallet": 'FAKE_0x%s' % uuid.uuid4().hex, "balance": '100'})

    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid token"})


@app.get("/api/transactions", status_code=200, responses={
    401: {"description": "Invalid Token"}})
def transactions(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user_name = auth_handler.decode_token(token)['username'].strip()
        transactions_ls = database_utils.get_all_transaction_from_user(user_name)
        output = []
        for transaction in transactions_ls:
            output.append({
                            "to": '%s' % transaction[0],
                            "amount": '%s' % transaction[1],
                            "ts": '%s' % transaction[2],
                            })

        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"transactions": output})

    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid token"})


@app.get("/api/projects", status_code=200, responses={
    401: {"description": "Invalid Token"}})
def projects(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
   0 address _owner,
   1 string memory _description,
   2 uint _minDonation,
   3 uint _raisedDonation,
   4 uint _goal,
   5 uint _numberOfDonors,
   6 uint _numRequests
    """
    token = credentials.credentials
    if auth_handler.decode_token(token):
        # user_name = auth_handler.decode_token(token)['username'].strip()

        projects_addy_ls = database_utils.get_all_project_addy()
        projects_ls = []
        for each_addy in projects_addy_ls:
            project_details = blockchain_utils.get_project_summary(each_addy)
            projects_ls.append({
                'owner': project_details[0],
                'participated': False,
                'description': project_details[1],
                'minDonation': project_details[2],
                'raisedDonation': project_details[3],
                'goal': project_details[4],
                'numberOfDonors': project_details[5],
                'numRequests': project_details[6],
                'donations': {},
                'requests': []
            })

        # projects_ls = []
        # for i in range(10):
        #     projects_ls.append({
        #         'owner': 'FAKE_0x%s' % uuid.uuid4().hex,
        #         'participated': (True, False)[random.randint(-1, 1)],
        #         'description': 'description-%s' % i,
        #         'minDonation': '10',
        #         'raisedDonation': '500',
        #         'goal': '1000',
        #         'numberOfDonors': '5',
        #         'donations': {'FAKE_0x%s' % uuid.uuid4().hex: '100',
        #                       'FAKE_0x%s' % uuid.uuid4().hex: '200',
        #                       'FAKE_0x%s' % uuid.uuid4().hex: '100',
        #                       'FAKE_0x%s' % uuid.uuid4().hex: '50',
        #                       'FAKE_0x%s' % uuid.uuid4().hex: '50'},
        #         'requests': [
        #             {'requestDescription': 'requestDescription-1',
        #              'value': '100',
        #              'recipient': 'FAKE_0x%s' % uuid.uuid4().hex,
        #              'completed': True,
        #              'request_id': '1',
        #              'voted': False
        #              },
        #             {'requestDescription': 'requestDescription-22',
        #              'value': '50',
        #              'recipient': 'FAKE_0x%s' % uuid.uuid4().hex,
        #              'completed': False,
        #              'request_id': '0',
        #              'voted': False
        #              }
        #         ]
        #     })

        return JSONResponse(status_code=status.HTTP_200_OK, content={"projects": projects_ls})
    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid token"})


@app.post("/api/donate", status_code=201)
def donate(donate_form: DonateForm, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        # {"username": res[0][0], "wallet": res[0][1], "password": res[0][2], "private_key": res[0][3]}
        user = auth_handler.decode_token(token)
        try:
            blockchain_utils.contribute_to(user['wallet'], user['private_key'],
                                           donate_form.project_addy, donate_form.amount)
        except Exception as err:
            print(err)
            traceback.print_exc()
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"msg": "Server error"})
        else:
            database_utils.donate(user['username'], donate_form.project_addy, donate_form.amount)
            print('Send %s to %s' % (donate_form.amount, donate_form.project_addy))
            return JSONResponse(status_code=status.HTTP_200_OK,
                                content='Send %s to %s' % (donate_form.amount, donate_form.project_addy))


@app.post("/api/create_project", status_code=201)
def create_project(create_project_form: CreateProjectForm,
                   credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user = auth_handler.decode_token(token)
        try:
            project_addy = blockchain_utils.create_project(user['wallet'], user['private_key'], create_project_form)
        except Exception as err:
            print(err)
            traceback.print_exc()
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"msg": "Server error"})
        else:
            print(project_addy)
            database_utils.create_project(user['username'], project_addy)
            return JSONResponse(status_code=status.HTTP_200_OK,
                                content={"msg": 'Create project %s ' % create_project_form.description})


@app.post("/api/vote", status_code=201)
def vote(vote_form: VoteForm, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        print('Vote project %s request %s ' % (vote_form.project_address, vote_form.request_id))
        return {"msg": 'Vote project %s request %s ' % (vote_form.project_address, vote_form.request_id)}


@app.post("/api/create_request", status_code=201)
def create_request(create_request_form: CreateRequestForm,
                   credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        print('Create request %s for project %s '
              % (create_request_form.description, create_request_form.project_addy))

        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"msg": 'Create request %s for project %s '
                                            % (create_request_form.description, create_request_form.project_addy)})


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
