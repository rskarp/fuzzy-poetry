from pydantic import BaseModel


class PoemV2CreateRequest(BaseModel):
    name: str
    email: str
    message: str
