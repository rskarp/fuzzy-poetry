from src.services.notification_service import NotificationService
from src.services.poem_v3_service import PoemV3Service
from src.services.poem_v4_service import PoemV4Service
from functools import lru_cache
from importlib.metadata import version, PackageNotFoundError
import boto3
from openai import OpenAI
import os
import datamuse
from sendgrid import SendGridAPIClient


def get_version():
    try:
        return version("fuzzy-poetry-api")
    except PackageNotFoundError:
        return "unknown"


@lru_cache()
def get_openai_client():
    return OpenAI(
        organization=os.getenv("OPENAI_ORGANIZATION"),
        api_key=os.getenv("OPENAI_API_KEY"),
    )


@lru_cache()
def get_bedrock_client():
    return boto3.client(service_name="bedrock-runtime", region_name="us-east-1")


@lru_cache()
def get_datamuse_client():
    return datamuse.Datamuse()


@lru_cache()
def get_ses_client():
    return boto3.client("ses", region_name="us-east-1")


def get_lancedb_client():
    # db = get_db()
    # try:
    #     yield db
    # finally:
    #     db.close()
    pass


@lru_cache()
def get_poem_v4_service():
    return PoemV4Service(
        get_openai_client(), get_datamuse_client(), get_bedrock_client()
    )


@lru_cache()
def get_poem_v3_service():
    return PoemV3Service(
        get_openai_client(), get_datamuse_client(), get_bedrock_client()
    )


@lru_cache()
def get_notification_service():
    return NotificationService(get_ses_client())
