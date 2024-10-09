import os
import boto3
import json

interviews_sqs_url = os.environ.get('INTERVIEW_SCHEDULER_QUEUE_URL')


def post(body):
    print('Posting message to SQS')
    sqs_client = boto3.client('sqs')

    response = sqs_client.send_message(
        QueueUrl=interviews_sqs_url,
        MessageBody=json.dumps(body)
    )
