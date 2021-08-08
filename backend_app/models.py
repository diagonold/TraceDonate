from pydantic import BaseModel


class CredentialsForm(BaseModel):
    username: str
    password: str


class SendPaymentForm(BaseModel):
    receiver_wallet: str
    amount: float


class VoteForm(BaseModel):
    project_address: str
    request_id: int



