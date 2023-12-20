import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

sendGridKey = os.environ['SENDGRID_API_KEY']


def handler(event, context):
    print(f'received event: {event}')
    senderName = event['arguments']['senderName']
    senderAddress = event['arguments']['senderAddress']
    emailContent = event['arguments']['emailContent']
    emailSubject = event['arguments']['emailSubject']

    emailBody = f'Message from {senderName} ({senderAddress})\nSubject: {emailSubject}\n\n{emailContent}'

    message = Mail(
        from_email='fuzzypoetry1@gmail.com',
        to_emails='fuzzypoetry1@gmail.com',
        subject=f'Fuzzy Poetry Feedback from {senderName}',
        plain_text_content=emailBody)
    try:
        sg = SendGridAPIClient(sendGridKey)
        return sg.send(message)
    except Exception as e:
        raise e
