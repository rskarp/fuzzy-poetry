from src.models.common import PoemResponse
from src.services.poem_v3_service import PoemV3Service
from fastapi import APIRouter, Depends
from src.models.poem_v3 import PoemV3CreateRequest
from src.dependencies import get_poem_v3_service

router = APIRouter()


@router.post("/generate-poem-v3", response_model=PoemResponse)
async def generatePoemV3(
    request: PoemV3CreateRequest, service: PoemV3Service = Depends(get_poem_v3_service)
):
    poem_content = service.generatePoem(request)
    return PoemResponse(poem_content=poem_content)
