from fastapi import APIRouter, Depends
from models.poem_v4 import PoemV4CreateRequest
from dependencies import get_lancedb_client

router = APIRouter()


@router.post("/generate-poem-v4")
async def generatePoemV4(
    request: PoemV4CreateRequest, db: str = Depends(get_lancedb_client)
):
    return {"message": "Hello from Poem V4"}
