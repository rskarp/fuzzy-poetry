from fastapi import FastAPI
from src.config.logging_config import setup_logging
import logging
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware
import os
from mangum import Mangum

load_dotenv()

from src.api import root, health, poem_v1, poem_v2, poem_v3, poem_v4

setup_logging()
logger = logging.getLogger(__name__)

app = FastAPI()

origins_string = os.getenv("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in origins_string.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=[
        "GET",
        "PUT",
        "POST",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Origin",
        "Accept",
    ],
    expose_headers=[
        "Content-Type",
    ],
    max_age=3600,
)


@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Application started successfully")


app.include_router(root.router)
app.include_router(health.router)
app.include_router(poem_v1.router)
app.include_router(poem_v2.router)
app.include_router(poem_v3.router)
app.include_router(poem_v4.router)

handler = Mangum(app)
