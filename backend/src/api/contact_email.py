from src.services.notification_service import NotificationService
from fastapi import APIRouter, Depends
from src.models.contact_email import ContactEmailCreateRequest, ContactEmailResponse
from src.dependencies import get_notification_service

router = APIRouter()


@router.post("/send-contact-email", response_model=ContactEmailResponse)
async def sendContactEmail(
    request: ContactEmailCreateRequest,
    service: NotificationService = Depends(get_notification_service),
):
    response = service.send_email(request)
    return ContactEmailResponse(
        status_code=response["ResponseMetadata"]["HTTPStatusCode"]
    )
