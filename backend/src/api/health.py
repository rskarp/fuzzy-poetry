from src.dependencies import get_bedrock_client, get_openai_client
from fastapi import APIRouter, Depends
from datetime import datetime, timezone
import boto3
from openai import OpenAI
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health")
async def health_check():
    """Basic health check - always returns healthy if API is running"""
    return {"status": "healthy"}


@router.get("/health/detailed")
async def detailed_health_check(
    openai_client: OpenAI = Depends(get_openai_client),
    bedrock_client: boto3.client = Depends(get_bedrock_client),
):
    """Detailed health check including external dependencies"""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "checks": {},
    }

    # Check OpenAI - just verify client is configured
    try:
        # Check if API key exists
        if openai_client.api_key:
            health_status["checks"]["openai"] = {
                "status": "configured",
                "api_key_set": True,
            }
        else:
            health_status["checks"]["openai"] = {
                "status": "not_configured",
                "api_key_set": False,
            }
            health_status["status"] = "degraded"
    except Exception as e:
        logger.error(f"OpenAI health check failed: {e}")
        health_status["checks"]["openai"] = {"status": "error", "message": str(e)}
        health_status["status"] = "degraded"

    # Check Bedrock - verify client is configured
    try:
        # Check if client has credentials
        credentials = bedrock_client._request_signer._credentials
        if credentials:
            health_status["checks"]["bedrock"] = {
                "status": "configured",
                "credentials_set": True,
            }
        else:
            health_status["checks"]["bedrock"] = {"status": "not_configured"}
            health_status["status"] = "degraded"
    except Exception as e:
        logger.error(f"Bedrock health check failed: {e}")
        health_status["checks"]["bedrock"] = {"status": "error", "message": str(e)}
        health_status["status"] = "degraded"

    # Check AWS
    try:
        _ = boto3.client("sts")
        health_status["checks"]["aws"] = {
            "status": "healthy",
        }
    except Exception as e:
        logger.error(f"AWS health check failed: {e}")
        health_status["checks"]["aws"] = {"status": "error", "message": str(e)}
        health_status["status"] = "degraded"

    return health_status
