from pydantic import BaseModel


class CredentialsForm(BaseModel):
    username: str
    password: str


class DonateForm(BaseModel):
    project_addy: str
    amount: float


class VoteForm(BaseModel):
    project_addy: str
    request_id: int


class CreateProjectForm(BaseModel):
    description: str
    min_donation_amount: float
    goal: float


class CreateRequestForm(BaseModel):
    project_addy: str
    description: str
    receiver_addy: str
    amount: float
