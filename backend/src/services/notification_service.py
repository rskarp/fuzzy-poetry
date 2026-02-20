import logging
from src.models.contact_email import ContactEmailCreateRequest
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class NotificationService:
    def __init__(self, ses_client: boto3.client):
        self.ses_client = ses_client

    def send_email(self, request: ContactEmailCreateRequest):
        emailBody = f"Message from {request.senderName} ({request.senderAddress})\nSubject: {request.emailSubject}\n\n{request.emailContent}"

        CHARSET = "UTF-8"

        try:
            response = self.ses_client.send_email(
                Destination={
                    "ToAddresses": [
                        "fuzzypoetry1@gmail.com",
                    ],
                },
                Message={
                    "Body": {
                        "Text": {
                            "Charset": CHARSET,
                            "Data": emailBody,
                        },
                    },
                    "Subject": {
                        "Charset": CHARSET,
                        "Data": f"Fuzzy Poetry Feedback from {request.senderName}",
                    },
                },
                Source="Fuzzy Poetry Feedback <feedback@mail.fuzzypoetry.com>",
            )
            return response

        except ClientError as e:
            logger.error(e.response["Error"]["Message"])
