from pydantic import BaseModel


class PoemV1CreateRequest(BaseModel):
    name: str
    email: str
    message: str
