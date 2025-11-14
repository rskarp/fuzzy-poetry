from src.dependencies import get_version
from fastapi import APIRouter, Depends
from fastapi.responses import RedirectResponse

router = APIRouter()


@router.get("/", include_in_schema=False)
async def root():
    """Redirect to API documentation"""
    return RedirectResponse(url="/docs")


@router.get("/info")
async def api_info(version: str = Depends(get_version)):
    return {
        "name": "Fuzzy Poetry API",
        "version": version,
        "description": "Generate creative poetry variations using AI",
        "docs": "/docs",
        "health": "/health",
    }
