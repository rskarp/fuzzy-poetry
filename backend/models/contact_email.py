from pydantic import BaseModel


class ContactEmailCreateRequest(BaseModel):
    name: str
    email: str
    message: str
