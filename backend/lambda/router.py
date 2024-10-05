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
@route('/profile', ['OPTIONS'])
@route('/profile/{profileId}', ['OPTIONS'])
@route('/profile/{profileId}/student-teams', ['OPTIONS'])
@route('/student-team', ['OPTIONS'])
@route('/student-team/{studentTeamId}', ['OPTIONS'])
@route('/student-team/{studentTeamId}/members', ['OPTIONS'])
@route('/student-team/{studentTeamId}/members/{profileId}', ['OPTIONS'])
@route('/recruitment-round', ['OPTIONS'])
@route('/student-team/{studentTeamId}/recruitment-round', ['OPTIONS'])
@route('/recruitment-round/{roundId}', ['OPTIONS'])
@route('/opening', ['OPTIONS'])
@route('/recruitment-round/{roundId}/opening', ['OPTIONS'])
@route('/opening/{openingId}', ['OPTIONS'])
@route('/student-team/{studentTeamId}/team-lead-assign', ['OPTIONS'])
@route('/opening/{openingId}/team-lead-assign', ['OPTIONS'])
@route('/opening/{openingId}/team-lead-assign/{profileId}', ['OPTIONS'])
@route('/application', ['OPTIONS'])
@route('/opening/{openingId}/application', ['OPTIONS'])
@route('/application/{applicationId}', ['OPTIONS'])
# This is for scheduling availabilities
@route('/send-interview-emails/{openingId}', ['OPTIONS'])
@route('/decrypt/{id}', ['OPTIONS'])
@route('/opening/{openingId}/schedule-interviews', ['OPTIONS'])
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


@route('/profile/{profileId}/student-teams', ['GET'])
def get_student_teams_for_profile(path_params={}, _={}, __={}):
    profile_id = path_params.get('profileId')
    data = controller.get_student_teams_for_profile(profile_id)
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

    required_fields = ['name', 'description']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }

    try:
        name = data['name']
        description = data['description']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }

    response = controller.create_student_team(name, description)

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

# ------------------ STUDENT TEAM MEMEBERS ------------------


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

    response = controller.add_member_to_student_team(
        student_team_id, email, role)

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

    response = controller.update_student_team_member(
        student_team_id, profile_id, data)

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
    data = controller.remove_member_from_student_team(
        student_team_id, profile_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response

# ------------------ RECRUITMENT ROUND ------------------


@route('/recruitment-round', ['GET'])
def get_all_recruitment_rounds(path_params={}, _={}, __={}):
    data = controller.get_all_recruitment_rounds()
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response


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

    required_fields = ['semester', 'year', 'application_deadline',
                       'interview_preference_deadline', 'interview_period', 'status']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }

    try:
        semester = data['semester']
        year = data['year']
        application_deadline = data['application_deadline']
        interview_preference_deadline = data['interview_preference_deadline']
        interview_period = data['interview_period']
        status = data['status']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }

    response = controller.create_recruitment_round(
        student_team_id, semester, year, application_deadline, interview_preference_deadline, interview_period, status)

    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }


@route('/student-team/{studentTeamId}/recruitment-round', ['GET'])
def get_all_recruitment_rounds_for_student_team(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    data = controller.get_all_recruitment_rounds_for_student_team(
        student_team_id)
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


@route('/opening', ['GET'])
def get_all_openings(path_params={}, _={}, __={}):
    data = controller.get_all_openings()
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response


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

    required_fields = ['title', 'description', 'status', 'required_skills',
                       'desired_skills', 'task_email_format', 'task_enabled']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }

    try:
        title = data['title']
        description = data['description']
        status = data['status']
        required_skills = data['required_skills']
        desired_skills = data['desired_skills']
        task_email_format = data['task_email_format']
        task_enabled = data['task_enabled']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }

    response = controller.create_opening(
        round_id, title, description, status, required_skills, desired_skills, task_email_format, task_enabled)

    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }


@route('/recruitment-round/{roundId}/opening', ['GET'])
def get_all_openings_for_recruitment_round(path_params={}, _={}, __={}):
    round_id = path_params.get('roundId')
    data = controller.get_all_openings_for_recruitment_round(round_id)
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

# ------------------ TEAM LEAD APPLICATION ASSIGNMENT ------------------


@route('/student-team/{studentTeamId}/team-lead-assign', ['GET'])
def get_team_lead_for_student_team(path_params={}, _={}, __={}):
    student_team_id = path_params.get('studentTeamId')
    data = controller.get_team_lead_for_student_team(student_team_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response


@route('/opening/{openingId}/team-lead-assign', ['POST'])
def assign_team_lead_to_opening(path_params={}, _={}, body={}):
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

    required_fields = ['profile_id']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }

    try:
        profile_id = data['profile_id']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }

    response = controller.assign_team_lead_to_opening(opening_id, profile_id)

    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }


@route('/opening/{openingId}/team-lead-assign', ['GET'])
def get_team_lead_for_opening(path_params={}, _={}, __={}):
    opening_id = path_params.get('openingId')
    data = controller.get_team_lead_for_opening(opening_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response


@route('/opening/{openingId}/team-lead-assign/{profileId}', ['DELETE'])
def remove_team_lead_from_opening(path_params={}, _={}, __={}):
    opening_id = path_params.get('openingId')
    profile_id = path_params.get('profileId')
    data = controller.remove_team_lead_from_opening(opening_id, profile_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response


@route('/opening/{openingId}/team-lead-assign/{profileId}', ['GET'])
def get_team_lead_opening_assignment_status(path_params={}, _={}, __={}):
    opening_id = path_params.get('openingId')
    profile_id = path_params.get('profileId')
    data = controller.get_team_lead_opening_assignment_status(
        opening_id, profile_id)
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response


# ------------------ APPLICATIONS ------------------

@route('/application', ['GET'])
def get_all_applications(path_params={}, _={}, __={}):
    data = controller.get_all_applications()
    data = json.dumps(data)

    response = {
        'statusCode': 200,
        'body': data,
        'headers': HEADERS
    }

    return response


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

    required_fields = [
        'email', 'name', 'phone', 'semesters_until_completion',
        'current_semester', 'major_enrolled', 'additional_info',
        # 'created_at', 'candidate_availability', 'interview_date', 'interview_notes', 'interview_score', 'status',
        'skills', 'course_name'
    ]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Missing required fields: {", ".join(missing_fields)}'}),
            'headers': HEADERS
        }

    try:
        email = data['email']
        name = data['name']
        phone = data['phone']
        semesters_until_completion = data['semesters_until_completion']
        current_semester = data['current_semester']
        major_enrolled = data['major_enrolled']
        additional_info = data['additional_info']
        skills = data['skills']
        # created_at = data['created_at']
        # candidate_availability = data['candidate_availability']
        # interview_date = data['interview_date']
        # interview_notes = data['interview_notes']
        # interview_score = data['interview_score']
        # status = data['status']
        course_name = data['course_name']
    except (ValueError, KeyError):
        return {
            'statusCode': 400,
            'body': json.dumps({'error': 'Invalid data types in request body'}),
            'headers': HEADERS
        }

    response = controller.create_application(
        email, name, phone, semesters_until_completion,
        current_semester, major_enrolled, additional_info,
        skills, opening_id, course_name
        # interview_notes, interview_score, created_at, candidate_availability, interview_date, status,
    )

    return {
        'statusCode': 201,
        'body': json.dumps({
            'success': True,
            'data': response
        }),
        'headers': HEADERS
    }


@route('/opening/{openingId}/application', ['GET'])
def get_all_applications_for_opening(path_params={}, _={}, __={}):
    opening_id = path_params.get('openingId')
    data = controller.get_all_applications_for_opening(opening_id)
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


# ------------------ MISC ------------------

@route('/send-interview-emails/{openingId}', ['POST'])
def send_email(path_params={}, querystring_params={}, body={}):
    try:
        opening_id = path_params.get('openingId')

        print(opening_id, "opening_id")

        data = controller.send_interview_email(opening_id)
        print(data, "data")
        data = json.dumps(data)

        response = {
            'statusCode': 200,
            'body': json.dumps({
                'success': True,
                'msg': data
            }),
            'headers': HEADERS
        }
        return response
    except Exception as e:
        error_message = f"An error occurred: {str(e)}"
        response = {
            'statusCode': 500,
            'body': json.dumps({
                'success': False,
                'error': error_message
            }),
            'headers': HEADERS
        }
        return response


@route('/decrypt/{id}', ['GET'])
def decrypt_id(path_params={}, _={}, __={}):
    id = path_params.get('id')
    result = controller.decrypt_id(id)

    if result is None:
        raise Exception(f"Could not decrypt ID {id}")

    response = {
        'statusCode': 200,
        'body': json.dumps({
            'success': True,
            'data': result
        }),
        'headers': HEADERS
    }
    return response


@route('/opening/{openingId}/schedule-interviews', ['POST'])
def schedule_interviews(path_params={}, _={}, body={}):
    opening_id = path_params.get('openingId')

    controller.schedule_interviews(opening_id)

    return {
        'statusCode': 200,
        'body': json.dumps({
            'success': True
        }),
        'headers': HEADERS
    }
