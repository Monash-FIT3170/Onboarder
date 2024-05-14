from supabase import create_client, Client
import os

# Set an environment variable
os.environ["SUPABASE_URL"] = "https://bcnxifsqkyzzpgshacts.supabase.co"
os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbnhpZnNxa3l6enBnc2hhY3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NjM5NjQsImV4cCI6MjAzMTEzOTk2NH0.XT_aSkBLaaaX-66BqDF7Z1oP5qlgJLGNXSovibjatdU"


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def get_all_rec_rounds():
    response = supabase.table('RECRUITMENT_ROUND').select("*").execute()
    data = response.data
    return data


def get_specific_rec_round(round_id):
    response = supabase.table('RECRUITMENT_ROUND').select(
        "*").eq("id", round_id).execute()

    data = response.data
    return data


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
