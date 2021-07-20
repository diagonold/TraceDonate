import uvicorn
import random, string

from fastapi import FastAPI, status
from fastapi.responses import JSONResponse

from models import *
from database_utils import *

app = FastAPI()


def random_str(length=32):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))


@app.get("/")
def root():
    return {"msg": "Blockchain Project API"}


@app.post("/register", status_code=201)
def register(register_form: CredentialsForm):
    if user_exist(register_form.username):
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            content={"msg": "username exists"})
    else:
        print(register_form.username)
        print(register_form.password)
        create_user(register_form.username, register_form.password, random_str())


@app.post("/login")
def login(login_form: CredentialsForm):
    return login_form


@app.get("/organizations")
def organizations():
    return {"organizations": "organizations api"}


@app.get("/transactions")
def transactions():
    return {"transactions": "transactions api"}


@app.post("/send")
def send():
    return {"send": "send api"}


@app.post("/topup")
def topup():
    return {"topup": "topup api"}


@app.post("/rate")
def rate():
    return {"rate": "rate api"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
