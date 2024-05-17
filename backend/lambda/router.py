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

    data = json.dumps(data)

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
    required_fields = ['deadline', 'semester',
                       'year', 'status']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        response = {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'})
        }
        return response

    try:
        deadline = data['deadline']
        semester = int(data['semester'])
        year = data["year"]
        status = str(data['status'])
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'})
        }

    # Create recruitment round
    try:
        response = controller.create_rec_round(
            deadline, semester, year, 2, status)
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

    records = json.dumps(records)

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

    records = json.dumps(records)

    response = {
        'statusCode': 200,
        'body': records,
        'headers': {
            "Content-Type": "application/json"
        }
    }

    return response


@route('/recruitmentRounds/{roundId}/openings', ['POST'])
def create_opening(path_params={}, __={}, body={}):
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
    required_fields = ['title', 'description',
                       'status', 'required_skills', 'desired_skills']
    missing_fields = [field for field in required_fields if field not in data]

    if missing_fields:
        response = {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'})
        }
        return response

    try:
        round_id = path_params.get('roundId')
        title = str(data['title'])
        description = str(data['description'])
        status = str(data['status'])
        required_skills = data['required_skills']
        desired_skills = data['desired_skills']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'})
        }

    # Create opening
    try:
        response = controller.create_opening(
            round_id, title, description, status, required_skills, desired_skills)
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


# APPLICATIONS

@route('/openings/{openingId}/applications', ['POST'])
def create_application(path_params={}, __={}, body={}):
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
    required_fields = ['email', 'name', 'phone', 'semesters_until_completion',
                       'current_semester', 'course_enrolled', 'major_enrolled', 'cover_letter', 'skills']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        response = {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'})
        }
        return response

    try:
        email = str(data['email'])
        name = str(data['name'])
        phone = str(data['phone'])
        semesters_until_completion = int(data['semesters_until_completion'])
        current_semester = int(data['current_semester'])
        course_enrolled = str(data['course_enrolled'])
        major_enrolled = str(data['major_enrolled'])
        cover_letter = str(data['cover_letter'])
        skills = data['skills']
        openingId = path_params.get('openingId')

    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'})
        }

    # Create application
    try:
        response = controller.create_application(
            openingId, email, name, phone, semesters_until_completion, current_semester, course_enrolled, major_enrolled, cover_letter, skills)
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


@route('/openings/{openingId}/applications', ['GET'])
def get_applications_for_opening(path_params={}, _={}, __={}):
    # parameter validation
    opening_id = path_params.get('openingId')
    records = controller.get_all_applications_for_opening(opening_id)

    records = json.dumps(records)

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

    records = json.dumps(records)

    response = {
        'statusCode': 200,
        'body': records,
        'headers': {
            "Content-Type": "application/json"
        }
    }
    return response


@route('/applications/{applicationId}/accept', ['POST'])
def acceptApplication(path_params={}, __={}, ___={}):
    application_id = path_params.get('applicationId')

    data = controller.accept_application(application_id)
    data = json.dumps(data)

    response = {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'msg': f"Application {application_id} accepted"
        })
    }
    return response


@route('/applications/{applicationId}/reject', ['POST'])
def rejectApplication(path_params={}, __={}, ___={}):
    application_id = path_params.get('applicationId')

    data = controller.reject_application(application_id)
    data = json.dumps(data)

    response = {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'msg': f"Application {application_id} rejected"
        })
    }
    return response
