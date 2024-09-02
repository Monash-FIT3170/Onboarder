
import controller
from typing import Callable
import json

routes = dict()

HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
}


def dispatch(event: dict):

    # intercept cognito here
    print(event)
    resource = event.get('resource')
    method = event.get('httpMethod')
    func = routes.get(resource, {}).get(method)

    path_params = event.get('pathParameters', {})

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


# OPTIONS HANDLER
@route('/profile/{profileId}', ['OPTIONS'])
@route('/studentTeams', ['OPTIONS'])
@route('/applications/{applicationId}', ['OPTIONS'])
@route('/studentTeams/{profileId}', ['OPTIONS'])
@route('/profile/{profileId}/availability', ['OPTIONS'])
@route('/profileTeamInfo', ['OPTIONS'])
@route('/profileTeamInfo/{studentTeamId}', ['OPTIONS'])
@route('/recruitmentRounds', ['OPTIONS'])
@route('/recruitmentRounds/{roundId}/openings', ['OPTIONS'])
@route('/openings', ['OPTIONS'])
@route('/openings/{openingId}', ['OPTIONS'])
@route('/openings/{openingId}/applications', ['OPTIONS'])
@route('/recruitmentRounds/{roundId}/status', ['OPTIONS'])
@route('/sendInterviewEmails/{openingId}', ['OPTIONS'])
@route('/updateAvailability/{applicationId}', ['OPTIONS'])
def options_handler(_={}, __={}, ___={}):
    return {
        'statusCode': 200,
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*"
        }
    }

# ------------------ PROFILE ------------------

@route('/profile', ['POST'])
def create_profile(path_params={}, _={}, body={}):
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    required_fields = ['user_id', 'email']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }
    
    try:
        user_id = data['user_id']
        email = data['email']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }
    
    response = controller.create_profile(user_id, email)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/profile', ['GET'])
def get_all_profiles(path_params={}, _={}, __={}):
    data = controller.get_all_profiles()
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/profile/{profileId}', ['PATCH'])
def update_profile(path_params={}, _={}, body={}):
    profile_id = path_params.get('profileId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    response = controller.update_profile(profile_id, data)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }   

@route('/profile/{profileId}', ['GET'])
def get_profile(path_params={}, _={}, __={}):
    profile_id = path_params.get('profileId')
    data = controller.get_profile(profile_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/profile/{profileId}', ['DELETE'])
def delete_profile(path_params={}, _={}, __={}):
    profile_id = path_params.get('profileId')
    data = controller.delete_profile(profile_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

# ------------------ STUDENT TEAMS ------------------

@route('/student-team', ['POST'])
def create_student_team(path_params={}, _={}, body={}):
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    required_fields = ['team_name', 'team_description']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }
    
    try:
        team_name = data['team_name']
        team_description = data['team_description']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }
    
    response = controller.create_student_team(team_name, team_description)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/student-team', ['GET'])
def get_all_student_teams(path_params={}, _={}, __={}):
    data = controller.get_all_student_teams()
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/student-team/{studentTeamId}', ['PATCH'])
def update_student_team(path_params={}, _={}, body={}):
    student_team_id = path_params.get('studentTeamId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    response = controller.update_student_team(student_team_id, data)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/student-team/{studentTeamId}', ['GET'])
def get_student_team(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    data = controller.get_student_team(student_team_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/student-team/{studentTeamId}', ['DELETE'])
def delete_student_team(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    data = controller.delete_student_team(student_team_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/student-team/{studentTeamId}/members', ['POST'])
def add_member_to_student_team(path_params={}, _={}, body={}):
    student_team_id = path_params.get('studentTeamId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    required_fields = ['email', 'role']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }
    
    try:
        email = data['email']
        role = data['role']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }
    
    response = controller.add_member_to_student_team(email, student_team_id, role)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/student-team/{studentTeamId}/members', ['GET'])
def get_all_members_of_student_team(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    data = controller.get_all_members_of_student_team(student_team_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/student-team/{studentTeamId}/members/{profileId}', ['PATCH'])
def update_student_team_member(path_params={}, _={}, body={}):
    student_team_id = path_params.get('studentTeamId')
    profile_id = path_params.get('profileId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    response = controller.update_student_team_member(student_team_id, profile_id, data)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/student-team/{studentTeamId}/members/{profileId}', ['GET'])
def get_student_team_member(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    profile_id = path_params.get('profileId')
    data = controller.get_student_team_member(student_team_id, profile_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/student-team/{studentTeamId}/members/{profileId}', ['DELETE'])
def remove_member_from_student_team(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    profile_id = path_params.get('profileId')
    data = controller.remove_member_from_student_team(student_team_id, profile_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

# ------------------ RECRUITMENT ROUND ------------------

@route('/student-team/{studentTeamId}/recruitment-round', ['POST'])
def create_recruitment_round(path_params={}, _={}, body={}):
    student_team_id = path_params.get('studentTeamId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    required_fields = ['round_name', 'round_description', 'start_date', 'end_date']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }
    
    try:
        round_name = data['round_name']
        round_description = data['round_description']
        start_date = data['start_date']
        end_date = data['end_date']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }
    
    response = controller.create_recruitment_round(student_team_id, round_name, round_description, start_date, end_date)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/student-team/{studentTeamId}/recruitment-round', ['GET'])
def get_all_recruitment_rounds(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    data = controller.get_all_recruitment_rounds(student_team_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/recruitment-round/{roundId}', ['PATCH'])
def update_recruitment_round(path_params={}, _={}, body={}):
    round_id = path_params.get('roundId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    response = controller.update_recruitment_round(round_id, data)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/recruitment-round/{roundId}', ['GET'])
def get_recruitment_round(path_params={}, _={}, __={}):
    round_id = path_params.get('roundId')
    data = controller.get_recruitment_round(round_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/recruitment-round/{roundId}', ['DELETE'])
def delete_recruitment_round(path_params={}, _={}, __={}):
    round_id = path_params.get('roundId')
    data = controller.delete_recruitment_round(round_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

# ------------------ OPENINGS ------------------

@route('/recruitment-round/{roundId}/opening', ['POST'])
def create_opening(path_params={}, _={}, body={}):
    round_id = path_params.get('roundId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    required_fields = ['opening_name', 'opening_description', 'start_date', 'end_date']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }
    
    try:
        opening_name = data['opening_name']
        opening_description = data['opening_description']
        start_date = data['start_date']
        end_date = data['end_date']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }
    
    response = controller.create_opening(round_id, opening_name, opening_description, start_date, end_date)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/recruitment-round/{roundId}/opening', ['GET'])
def get_all_openings(path_params={}, _={}, __={}):
    round_id = path_params.get('roundId')
    data = controller.get_all_openings(round_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/opening/{openingId}', ['PATCH'])
def update_opening(path_params={}, _={}, body={}):
    opening_id = path_params.get('openingId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    response = controller.update_opening(opening_id, data)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/opening/{openingId}', ['GET'])
def get_opening(path_params={}, _={}, __={}):
    opening_id = path_params.get('openingId')
    data = controller.get_opening(opening_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/opening/{openingId}', ['DELETE'])
def delete_opening(path_params={}, _={}, __={}):
    opening_id = path_params.get('openingId')
    data = controller.delete_opening(opening_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

# ------------------ APPLICATIONS ------------------

@route('/opening/{openingId}/application', ['POST'])
def create_application(path_params={}, _={}, body={}):
    opening_id = path_params.get('openingId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    required_fields = ['profile_id', 'status']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }
    
    try:
        profile_id = data['profile_id']
        status = data['status']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }
    
    response = controller.create_application(opening_id, profile_id, status)
    
    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/opening/{openingId}/application', ['GET'])
def get_all_applications(path_params={}, _={}, __={}):
    opening_id = path_params.get('openingId')
    data = controller.get_all_applications(opening_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/application/{applicationId}', ['PATCH'])
def update_application(path_params={}, _={}, body={}):
    application_id = path_params.get('applicationId')
    if not body:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Request body is missing'}),
            'headers': HEADERS
        }
    
    try:
        data = json.loads(body)
    except ValueError:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid request body'}),
            'headers': HEADERS
        }
    
    response = controller.update_application(application_id, data)
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }

@route('/application/{applicationId}', ['GET'])
def get_application(path_params={}, _={}, __={}):
    application_id = path_params.get('applicationId')
    data = controller.get_application(application_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

@route('/application/{applicationId}', ['DELETE'])
def delete_application(path_params={}, _={}, __={}):
    application_id = path_params.get('applicationId')
    data = controller.delete_application(application_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response





