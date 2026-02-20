from src.models.common import PoemResponse
from src.dependencies import get_poem_v3_service
from src.services.poem_v3_service import PoemV3Service
from fastapi import APIRouter, Depends
from src.models.poem_v1 import PoemV1CreateRequest

router = APIRouter()


@router.post("/generate-poem-v1", response_model=PoemResponse)
async def generatePoemV1(
    request: PoemV1CreateRequest, service: PoemV3Service = Depends(get_poem_v3_service)
):
    poem_content = service.generateV1Poem(request)
    return PoemResponse(poem_content=poem_content)
