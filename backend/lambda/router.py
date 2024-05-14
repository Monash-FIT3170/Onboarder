import json

from typing import Callable

import controller

routes = dict()

# maybe just use fastapi


def dispatch(event: dict):

    # intercept cognito here

    resource = event.get('resource')
    method = event.get('httpMethod')
    func = routes.get(resource, {}).get(method)

    path_params = event.get('pathParameters', {})
    # print(event)
    querystring_params = event.get('queryStringParameters', {})
    body = event.get('body', {})
    # possible validation here

    result = func(path_params, querystring_params, body)

    return result


def route(path: str, methods: list[str]) -> Callable:
    def inner(func):
        if path not in routes:
            routes[path] = {}

        for method in methods:
            routes[path][method] = func

        def wrapper(*args, **kwargs):
            return func(*args, **kwargs)

        return wrapper

    return inner


# RECRUITMENT ROUNDS

@route('/recruitmentRounds', ['GET'])
@route('/recruitmentRounds/{roundId}', ['GET'])
def fetch_recruitment_rounds(path_params={}, _={}, __={}):
    round_id = None
    # parameter validation
    if path_params:
        round_id = path_params.get('roundId')
    if round_id:
        data = controller.get_specific_rec_round(round_id)
    else:
        data = controller.get_all_rec_rounds()

    response = {
        'statusCode': 200,
        'body': data,
        'headers': {
            "Content-Type": "application/json"
        }
    }

    return response


@route('/recruitmentRounds', ['POST'])
def create_recruitment_round(_={}, __={}, body={}):

    # Get the request body
    if not body:
        response = {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'})
        }
        return response

    # Parse the request body as JSON
    try:
        data = json.loads(body)
    except ValueError:
        response = {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'})
        }
        return response

    # Validate the request body structure and ensure all required fields are present
    required_fields = ['semester', 'year', 'student_team_id', 'status']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        response = {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'})
        }
        return response

    try:
        semester = int(data['semester'])
        year = data["year"]
        student_team_id = int(data['student_team_id'])
        status = str(data['status'])
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'})
        }

    # Create recruitment round
    try:
        response = controller.create_rec_round(
            semester, year, student_team_id, status)
        return {
            'statusCode': 201,
            'body': json.dumps({
                'success': True,
                'data': response
            })
        }
    except Exception as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': str(e)})
        }


# OPENINGS


@route('/openings', ['GET'])
def get_all_openings(_={}, __={}, ___={}):

    records = controller.get_all_openings()

    response = {
        'statusCode': 200,
        'body': records,
        'headers': {
            "Content-Type": "application/json"
        }
    }
    return response


@route('/recruitmentRounds/{roundId}/openings', ['GET'])
@route('/recruitmentRounds/{roundId}/openings/{openingId}', ['GET'])
def get_openings_for_round(path_params={}, _={}, __={}):
    # parameter validation
    round_id = path_params.get('roundId')
    opening_id = path_params.get('openingId')
    if opening_id:
        records = controller.get_specific_open_for_round(round_id, opening_id)
    else:
        records = controller.get_all_opens_for_round(round_id)

    response = {
        'statusCode': 200,
        'body': records,
        'headers': {
            "Content-Type": "application/json"
        }
    }

    return response


@route('/recruitmentRounds/{roundId}/openings', ['POST'])
def create_opening(_={}, __={}, ___={}):

    controller.create_opening()

    response = {
        'statusCode': 201
    }
    return response


# APPLICATIONS

@route('/openings/{openingId}/applications', ['POST'])
def create_application(_={}, __={}, ___={}):

    controller.create_application()

    response = {
        'statusCode': 201
    }
    return response


@route('/openings/{openingId}/applications', ['GET'])
def get_applications_for_opening(path_params={}, _={}, __={}):
    # parameter validation
    opening_id = path_params.get('openingId')
    records = controller.get_all_applications_for_opening(opening_id)

    response = {
        'statusCode': 200,
        'body': records,
        'headers': {
            "Content-Type": "application/json"
        }
    }
    return response


@route('/applications/{applicationId}', ['GET'])
def get_application(path_params={}, _={}, __={}):
    # parameter validation
    application_id = path_params.get('applicationId')
    records = controller.get_application(application_id)

    response = {
        'statusCode': 200,
        'body': records,
        'headers': {
            "Content-Type": "application/json"
        }
    }
    return response


@route('/applications/{applicationId}/accept', ['POST'])
@route('/applications/{applicationId}/reject', ['POST'])
def create_application(_={}, __={}, ___={}):

    if True:  # path = accept
        controller.accept_application()
    else:
        controller.reject_application()

    response = {
        'statusCode': 201
    }
    return response
