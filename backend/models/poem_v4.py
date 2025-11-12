from pydantic import BaseModel


class PoemV4CreateRequest(BaseModel):
    name: str
    email: str
    message: str
