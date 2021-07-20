from pydantic import BaseModel


class CredentialsForm(BaseModel):
    username: str
    password: str


class SendPaymentForm(BaseModel):
    receiver_id: int
    amount: float


class TopUpForm(BaseModel):
    amount: float


class RatingForm(BaseModel):
    user_id: int
    score: int
    comment: str

