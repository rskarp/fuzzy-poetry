from fastapi import APIRouter
from models.poem_v3 import PoemV3CreateRequest

router = APIRouter()


@router.post("/generate-poem-v3")
async def generatePoemV3(request: PoemV3CreateRequest):
    return {"message": "Hello from Poem V3"}
