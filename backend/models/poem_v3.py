from pydantic import BaseModel


class PoemV3CreateRequest(BaseModel):
    name: str
    email: str
    message: str
