from src.services.poem_v4_service import PoemV4Service
from src.models.common import PoemResponse
from fastapi import APIRouter, Depends
from src.models.poem_v4 import PoemV4CreateRequest
from src.dependencies import get_poem_v4_service

router = APIRouter()


@router.post("/generate-poem-v4", response_model=PoemResponse)
async def generatePoemV4(
    request: PoemV4CreateRequest, service: PoemV4Service = Depends(get_poem_v4_service)
):
    poem_content = service.generatePoem(request)
    return PoemResponse(poem_content=poem_content)
