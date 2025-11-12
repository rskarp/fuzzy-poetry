from fastapi import APIRouter
from models.poem_v2 import PoemV2CreateRequest

router = APIRouter()


@router.post("/generate-poem-v2")
async def generatePoemV2(request: PoemV2CreateRequest):
    return {"message": "Hello from Poem V2"}
