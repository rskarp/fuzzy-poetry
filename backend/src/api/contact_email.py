from fastapi import APIRouter
from src.models.contact_email import ContactEmailCreateRequest

router = APIRouter()


@router.post("/send-contact-email")
async def sendContactEmail(request: ContactEmailCreateRequest):
    return {"message": "Hello from contact email"}
