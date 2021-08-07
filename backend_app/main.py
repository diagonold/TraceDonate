import uvicorn
import random, string

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
        token = auth_handler.encode_token(user['username'])
        return JSONResponse(status_code=status.HTTP_200_OK, content={"token": token, "username": user['username']})
    except Exception as err:
        print(err)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"msg": "Fail to login"})


@app.get("/api/wallets", status_code=200)
def wallets(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user_name = auth_handler.decode_token(token).strip()
        print(user_name)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"wallet": "FAKE_0xc39Bba04F774b825bE5060bf28645CD82AC29bA4", "balance": "100"})


@app.get("/api/transactions", status_code=200)
def transactions(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        user_name = auth_handler.decode_token(token).strip()
        print(user_name)
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"transactions": [
                                {"from": "FAKE_0xc39Bba04F774b825bE5060bf28645CD82AC29bA4",
                                 "to": "FAKE_0xa415Ae493283ac8e898dbD8D610D9C7453509B7F",
                                 "amount": "100",
                                 "ts": "1628323302"},
                                {"from": "FAKE_0xc39Bba04F774b825bE5060bf28645CD82AC29bA4",
                                 "to": "FAKE_0xa415Ae493283ac8e898dbD8D610D9C7453509B7F",
                                 "amount": "100",
                                 "ts": "1628323102"}
                            ]})


@app.get("/api/projects", status_code=200)
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
        user_name = auth_handler.decode_token(token).strip()
        print(user_name)
        project1 = {
            'owner': 'owner1',
            'description': 'description',
            'minDonation': '10',
            'raisedDonation': '500',
            'goal': '1000',
            'numberOfDonors': '5',
            'donations': {'addy1': '100', 'addy2': '200', 'addy3': '100', 'addy4': '50', 'addy5': '50'},
            'requests': [
                {'requestDescription': 'requestDescription1',
                 'value': '100',
                 'recipient': '0x26da4B386394223A0272e7418A7c8A4b28a05a3f',
                 'completed': True,
                 'index': '1'
                 },
                {'requestDescription': 'requestDescription2',
                 'value': '50',
                 'recipient': '0xf33E77a3E61d5Ed6C9BBb32305aa75765460BDaE',
                 'completed': True,
                 'index': '0'
                 }
            ]
        }

        project2 = {
            'owner': 'owner2',
            'description': 'description2',
            'minDonation': '10',
            'raisedDonation': '50',
            'goal': '1000',
            'numberOfDonors': '2',
            'donations': {'addy1': '100', 'addy2': '200', 'addy3': '100', 'addy4': '50', 'addy5': '50'},
            'requests': [
                {'requestDescription': 'requestDescription1',
                 'value': '100',
                 'recipient': '0x26da4B386394223A0272e7418A7c8A4b28a05a3f',
                 'completed': True,
                 'index': '1'
                 },
                {'requestDescription': 'requestDescription2',
                 'value': '50',
                 'recipient': '0xf33E77a3E61d5Ed6C9BBb32305aa75765460BDaE',
                 'completed': True,
                 'index': '0'
                 }
            ]
        }
        return JSONResponse(status_code=status.HTTP_200_OK, content={"projects": [project1, project2]})


@app.post("/api/send", status_code=201)
def send(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        return {"msg": "authorized send"}


@app.post("/api/vote", status_code=201)
def vote(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        return {"msg": "authorized rate"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
