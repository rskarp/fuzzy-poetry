import logging
import os
import pathlib
import uuid
from src.models.common import ALLOWED_EXTENSIONS
from src.models.image_upload import UploadUrlRequest
from fastapi import HTTPException
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class ImageService:
    def __init__(self, s3_client: boto3.client):
        self.s3_client = s3_client
        self.bucket_name = os.getenv("S3_BUCKET_NAME")

    def generate_upload_url(self, request: UploadUrlRequest):
        file_ext = pathlib.Path(request.fileName).suffix.lower()
        if file_ext not in ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail="Invalid file extension.")

        safe_name = f"{uuid.uuid4()}{file_ext}"
        object_key = f"uploads/{safe_name}"
        try:
            url = self.s3_client.generate_presigned_url(
                "put_object",
                Params={
                    "Bucket": self.bucket_name,
                    "Key": object_key,
                    "ContentType": request.fileType,
                    "Metadata": {"original-name": request.fileName},
                },
                ExpiresIn=300,  # 5 minutes
            )
            return {"uploadUrl": url, "fileKey": object_key}
        except ClientError as e:
            logger.error(e.response["Error"]["Message"])
            raise HTTPException(status_code=500, detail=str(e))

    def generate_download_url(self, object_key: str) -> str:
        try:
            url = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": object_key},
                ExpiresIn=300,  # 5 minutes
            )
            return url
        except ClientError as e:
            logger.error(e.response["Error"]["Message"])
            raise HTTPException(status_code=500, detail=str(e))

    def delete_object(self, object_key: str):
        self.s3_client.delete_object(Bucket=self.bucket_name, Key=object_key)
