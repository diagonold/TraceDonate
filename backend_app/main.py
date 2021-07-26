import uvicorn
import random, string
import os

from dotenv import load_dotenv

from fastapi import FastAPI, status, HTTPException, Security
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

from models import *
from database_utils import *
from auth import Auth

app = FastAPI()
security = HTTPBearer()
auth_handler = Auth()

load_dotenv()

DEV = os.getenv("DEV") == "True"

origins = []

if DEV:
    origins += [
        "http://localhost",
        "http://localhost:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def random_str(length=32):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


@app.get("/")
def root():
    return {"msg": "Blockchain Project API"}


@app.post("/register", status_code=201, responses={
    500: {"description": "Username exists / Server Error"}
})
def register(register_form: CredentialsForm):
    try:
        if user_exist(register_form.username):
            return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                content={"msg": "The username already exists"})
        else:
            hashed_password = auth_handler.encode_password(register_form.password)
            create_user(register_form.username, hashed_password, random_str())
    except:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"msg": "Fail to register"})


@app.post("/login", status_code=201, responses={
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
        return {'token': token}
    except:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content={"msg": "Fail to login"})


@app.get("/organizations", status_code=200)
def organizations(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        return {"msg": "authorized organizations"}


@app.get("/transactions", status_code=200)
def transactions(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        return {"msg": "authorized transactions"}


@app.post("/send", status_code=201)
def send(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        return {"msg": "authorized send"}


@app.post("/top_up", status_code=201)
def top_up(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        return {"msg": "authorized top_up"}


@app.post("/rate", status_code=201)
def rate(credentials: HTTPAuthorizationCredentials = Security(security)):
    token = credentials.credentials
    if auth_handler.decode_token(token):
        return {"msg": "authorized rate"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
