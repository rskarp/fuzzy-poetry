from src.dependencies import get_poem_v3_service
from src.models.common import PoemResponse
from src.services.poem_v3_service import PoemV3Service
from fastapi import APIRouter, Depends
from src.models.poem_v2 import PoemV2CreateRequest

router = APIRouter()


@router.post("/generate-poem-v2", response_model=PoemResponse)
async def generatePoemV2(
    request: PoemV2CreateRequest, service: PoemV3Service = Depends(get_poem_v3_service)
):
    poem_content = service.generateV2Poem(request)
    return PoemResponse(poem_content=poem_content)
