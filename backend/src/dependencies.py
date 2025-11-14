from src.services.poem_v4_service import PoemV4Service
from functools import lru_cache
from importlib.metadata import version, PackageNotFoundError
import boto3
from openai import OpenAI
import os
import datamuse


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
