from fastapi import APIRouter
from src.models.poem_v1 import PoemV1CreateRequest

router = APIRouter()


@router.post("/generate-poem-v1")
async def generatePoemV1(request: PoemV1CreateRequest):
    return {"message": "Hello from Poem V1"}
