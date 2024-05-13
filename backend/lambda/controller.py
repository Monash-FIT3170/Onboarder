


def get_all_rec_rounds():
    records = [
        {
            'recruitment_round_id': 45678,
            'year': 2024,
            'semester': '1',
            'student_team_ID': 12354,
            'status': 'A'
        },
        {
            'recruitment_round_id': 45677,
            'year': 2023,
            'semester': '2',
            'student_team_ID': 12354,
            'status': 'R'
        }
    ]
    return records


def get_specific_rec_round(round_id):
    records = [
        {
            'recruitment_round_id': int(round_id),
            'year': 2024,
            'semester': '1',
            'student_team_ID': 12354,
            'status': 'A'
        }
    ]
    return records


def create_rec_round():
    return 1


def get_all_openings():
    records = [
        {
            'opening_id': 345678,
            'recruitment_round_id': 45678,
            'title': 'OpeningTitle',
            'description': 'Description of Opening',
            'app_role': 'Some text',
            'status': 'Accepting',
            'required_skills': [],
            'desired_skills': []
        }
    ]
    return records


def get_specific_open_for_round(round_id, opening_id):
    records = [
        {
            'opening_id': opening_id,
            'recruitment_round_id': round_id,
            'title': 'OpeningTitle',
            'description': 'Description of Opening',
            'app_role': 'Some text',
            'status': 'Accepting',
            'required_skills': [],
            'desired_skills': []            
        }
    ]
    return records


def get_all_opens_for_round(round_id):
    records = [
        {
            'opening_id': 345678,
            'recruitment_round_id': round_id,
            'title': 'OpeningTitle',
            'description': 'Description of Opening',
            'app_role': 'Some text',
            'status': 'Accepting',
            'required_skills': [],
            'desired_skills': []
        },
        {
            'opening_id': 345679,
            'recruitment_round_id': round_id,
            'title': 'OpeningTitle2',
            'description': 'Description of Opening2',
            'app_role': 'Some text',
            'status': 'Accepting',
            'required_skills': [],
            'desired_skills': []            
        }
    ]
    return records


def create_opening():
    return 1


def create_application():
    return 1


def get_all_applications_for_opening(opening_id):
    records = [
        {
            'application_id': 4567,
            'opening_id': int(opening_id),
            'email': 'jerry.smith@gmail.com',
            'name': 'Jerry Smith',
            'phone': '0444333666',
            'semesters_until_completion': 4,
            'current_semester': 2,
            'course_enrolled': "Computer Science",
            'major_enrolled': "Subject",
            'cover_letter': "Lorem Ipsum Etc",
            'skills': []   
        }
    ]
    return records


def get_application(application_id):
    records = [
        {
            'application_id': application_id,
            'opening_id': 1423,
            'email': 'jerry.smith@gmail.com',
            'name': 'Jerry Smith',
            'phone': '0444333666',
            'semesters_until_completion': 4,
            'current_semester': 2,
            'course_enrolled': "Computer Science",
            'major_enrolled': "Subject",
            'cover_letter': "Lorem Ipsum Etc",
            'skills': []   
        }
    ]
    return records


def accept_application():
    return 1


def reject_application():
    return 1