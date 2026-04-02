from pydantic import BaseModel, Field, field_validator
from src.models.common import ALLOWED_MIME_TYPES


class UploadUrlRequest(BaseModel):
    fileName: str = Field(None, alias="fileName")
    fileType: str = Field(None, alias="fileType")

    class Config:
        populate_by_name = True

    @field_validator("fileType")
    @classmethod
    def validate_mime(cls, v):
        if v.lower() not in ALLOWED_MIME_TYPES:
            raise ValueError("Invalid file type. Only JPEG and PNG are allowed.")
        return v.lower()


class UploadUrlResponse(BaseModel):
    """Response model for image upload URL generation"""

    uploadUrl: str
    fileKey: str
