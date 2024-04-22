import json

def lambda_handler(event, context):
    body: {
        'opening_id': 345678,
        'recruitment_round_id': 45678,
        'title': 'OpeningTitle',
        'description': 'Description of Opening',
        'app_role': 'Some text',
        'status': 'Accepting'
    }
    response = {
        'statusCode': 200,
        'body': json.dumps(body)
    }
    return response
