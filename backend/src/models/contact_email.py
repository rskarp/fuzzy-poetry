from pydantic import BaseModel, Field


class ContactEmailCreateRequest(BaseModel):
    senderName: str = Field(None, alias="senderName")
    senderAddress: str = Field(None, alias="senderAddress")
    emailContent: str = Field(None, alias="emailContent")
    emailSubject: str = Field(None, alias="emailSubject")

    class Config:
        populate_by_name = True


class ContactEmailResponse(BaseModel):
    """Response model for a contact email"""

    status_code: int
