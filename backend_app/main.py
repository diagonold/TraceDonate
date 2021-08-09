import uvicorn
import random, string, uuid

from fastapi import FastAPI, status, Security
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

from models import *
from database_utils import *
from auth import Auth
from blockchain_utils import *

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
        if user_exist(register_form.username):
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                content={"msg": "The username already exists"})
        else:
            hashed_password = auth_handler.encode_password(register_form.password)
            account = create_account()
            create_user(register_form.username, hashed_password, account['address'], account['key'])
    except Exception as err:
        print(err)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"msg": "Fail to register"})


@app.post("/api/login", status_code=201, responses={
    401: {"description": "Invalid Username/ Password"},
    500: {"description": "Server Error"}
})
def login(login_form: CredentialsForm):
    try:
        user = get_user(login_form.username)
        if user is None:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid username"})
        if not auth_handler.verify_password(login_form.password, user['password']):
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid password"})
        token = auth_handler.encode_token(user)
        return JSONResponse(status_code=status.HTTP_200_OK, content={"token": token, "username": user['username']})
    except Exception as err:
        print(err)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"msg": "Fail to login"})


@app.get("/api/wallets", status_code=200, responses={
    401: {"description": "Invalid Token"}})
def wallets(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user = auth_handler.decode_token(token)
        # TODO change back to ganache function
        # wallet = user['wallet']
        # balance = get_balance(wallet)
        # return JSONResponse(status_code=status.HTTP_200_OK,
        #                     content={"wallet": wallet, "balance": balance})
        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"wallet": 'FAKE_0x%s' % uuid.uuid4().hex, "balance": '100'})

    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid token"})


@app.get("/api/transactions", status_code=200, responses={
    401: {"description": "Invalid Token"}})
def transactions(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user_name = auth_handler.decode_token(token).strip()
        print(user_name)
        # TODO: use web3 to get transactions of this account.
        transactions_ls = []
        for i in range(10):
            transactions_ls.append({"from": "FAKE_0x%s" % uuid.uuid4().hex,
                                    "to": "FAKE_0x%s" % uuid.uuid4().hex,
                                    "amount": "100",
                                    "ts": "1628%s302" % random.randint(100, 999)})

        return JSONResponse(status_code=status.HTTP_200_OK,
                            content={"transactions": transactions_ls})

    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid token"})


@app.get("/api/projects", status_code=200, responses={
    401: {"description": "Invalid Token"}})
def projects(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    address public owner;
    string public description;
    uint public minDonation;
    uint public raisedDonation = 0;
    uint public goal;
    uint public numberOfDonors;
    """
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user_name = auth_handler.decode_token(token)['username'].strip()
        print(user_name)
        projects_ls = []
        for i in range(10):
            projects_ls.append({
                'owner': 'FAKE_0x%s' % uuid.uuid4().hex,
                'participated': (True, False)[random.randint(-1, 1)],
                'description': 'description-%s' % i,
                'minDonation': '10',
                'raisedDonation': '500',
                'goal': '1000',
                'numberOfDonors': '5',
                'donations': {'FAKE_0x%s' % uuid.uuid4().hex: '100',
                              'FAKE_0x%s' % uuid.uuid4().hex: '200',
                              'FAKE_0x%s' % uuid.uuid4().hex: '100',
                              'FAKE_0x%s' % uuid.uuid4().hex: '50',
                              'FAKE_0x%s' % uuid.uuid4().hex: '50'},
                'requests': [
                    {'requestDescription': 'requestDescription-1',
                     'value': '100',
                     'recipient': 'FAKE_0x%s' % uuid.uuid4().hex,
                     'completed': True,
                     'index': '1'
                     },
                    {'requestDescription': 'requestDescription-22',
                     'value': '50',
                     'recipient': 'FAKE_0x%s' % uuid.uuid4().hex,
                     'completed': False,
                     'index': '0'
                     }
                ]
            })

        return JSONResponse(status_code=status.HTTP_200_OK, content={"projects": projects_ls})
    return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"msg": "Invalid token"})


@app.post("/api/send", status_code=201)
def send(send_payment_form: SendPaymentForm, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        print(send_payment_form)
        print('Send %s to %s' % (send_payment_form.amount, send_payment_form.receiver_wallet))
        return {"msg": "authorized send"}


@app.post("/api/vote", status_code=201)
def vote(vote_form: VoteForm, credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        print('Vote project %s request %s ' % (vote_form.project_address, vote_form.request_id))
        return {"msg": "authorized rate"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
