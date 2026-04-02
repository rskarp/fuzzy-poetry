from src.models.image_upload import UploadUrlRequest, UploadUrlResponse
from src.services.image_service import ImageService
from fastapi import APIRouter, Depends
from src.dependencies import get_image_service

router = APIRouter()


@router.post("/generate-upload-url", response_model=UploadUrlResponse)
async def generateUploadUrl(
    request: UploadUrlRequest,
    service: ImageService = Depends(get_image_service),
):
    response = service.generate_upload_url(request)
    return UploadUrlResponse(**response)
