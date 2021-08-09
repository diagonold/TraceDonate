from pydantic import BaseModel


class CredentialsForm(BaseModel):
    username: str
    password: str


class DonateForm(BaseModel):
    receiver_addy: str
    amount: float


class VoteForm(BaseModel):
    project_address: str
    request_id: int


class CreateProjectForm(BaseModel):
    description: str
    min_donation_amount: float
    goal: float
