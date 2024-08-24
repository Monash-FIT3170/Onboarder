from supabase import create_client, Client
import os

# Set an environment variable
os.environ["SUPABASE_URL"] = "https://bcnxifsqkyzzpgshacts.supabase.co"
os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbnhpZnNxa3l6enBnc2hhY3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NjM5NjQsImV4cCI6MjAzMTEzOTk2NH0.XT_aSkBLaaaX-66BqDF7Z1oP5qlgJLGNXSovibjatdU"

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# ---------------- ALL SETTER FUNCTIONS ----------------


def create_student_team(
    name
):
    data = {
        "name": name
    }

    response = supabase.table('STUDENT_TEAM').insert(data).execute()

    return response.data


def create_rec_round(
    student_team_id,
    deadline,
    semester,
    year,
    status
):
    # status can only be (A)ctive, (I)nactive, or A(R)chived
    data = {
        "student_team_id": student_team_id,
        "deadline": deadline,
        "semester": semester,
        "year": year,
        "status": status
    }

    response = supabase.table('RECRUITMENT_ROUND').insert(data).execute()

    return response.data


def create_opening(
    recruitment_round_ID,
    title,
    description,
    status,
    required_skills,
    desired_skills,
    task_email_format,
    task_enabled,
):
    # status can only be (A)ctive, (I)nactive, or A(R)chived
    data = {
        "recruitment_round_id": recruitment_round_ID,
        "title": title,
        "description": description,
        "status": status,
        "required_skills": required_skills,
        "desired_skills": desired_skills,
        "task_email_format": task_email_format,
        "task_enabled": task_enabled,
    }
    response = supabase.table('OPENING').insert(data).execute()

    return response.data


def create_application(
    openingId,
    email,
    name,
    phone,
    semesters_until_completion,
    current_semester,
    course_enrolled,
    major_enrolled,
    cover_letter,
    skills,
    candidate_availability,
    interview_date,
    interview_notes,
    profile_id
):
    data = {
        "opening_id": int(openingId),
        "email": email,
        "name": name,
        "phone": phone,
        "semesters_until_completion": semesters_until_completion,
        "current_semester": current_semester,
        "course_enrolled": course_enrolled,
        "major_enrolled": major_enrolled if major_enrolled else None,
        "cover_letter": cover_letter if cover_letter else None,
        "skills": skills,
        "candidate_availability": candidate_availability,
        "interview_date": interview_date,
        "interview_notes": interview_notes,
        "profile_id": profile_id
    }
    response = supabase.table('APPLICATION').insert(data).execute()

    return response.data

# ---------------- ALL GETTER FUNCTIONS ----------------

# STUDENT TEAM GETTERS
def get_all_student_teams():
    response = supabase.table('STUDENT_TEAM').select("*").execute()
    return response.data


def get_specific_student_team(student_team_id):
    response = supabase.table('STUDENT_TEAM') \
        .select("*") \
        .eq("id", student_team_id) \
        .execute()

    return response.data

def get_student_teams(profile_id):
    try: 
        response = supabase.table('student_teams_with_roles_and_owners') \
            .select("*") \
            .eq("profile_id", profile_id) \
            .execute()
    except Exception as e:
        print(e)
        return e


    return response.data

# RECRUITMENT ROUND GETTERS


def get_all_rec_rounds():
    response = supabase.rpc('get_all_rec_rounds_with_openings_count').execute()

    return response.data


def get_specific_rec_round(round_id):
    response = supabase.rpc('get_all_rec_rounds_with_openings_count') \
        .eq("id", round_id) \
        .execute()

    return response.data

# OPENINGS GETTERS


def get_all_openings():
    response = supabase.rpc('get_openings_with_application_count') \
        .select("*") \
        .execute()

    return response.data


def get_all_opens_for_round(round_id):
    response = supabase.rpc('get_openings_with_application_count') \
        .select("*") \
        .eq("recruitment_round_id", round_id) \
        .execute()

    return response.data


def get_specific_open_for_round(round_id, opening_id):
    response = supabase.rpc('get_openings_with_application_count').select(
        "*").eq("id", opening_id).eq("recruitment_round_id", round_id).execute()

    return response.data

# APPLICATION GETTERS


def get_all_applications_for_opening(opening_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("opening_id", opening_id).execute()

    return response.data


def get_application(application_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("id", application_id).execute()

    return response.data


def accept_application(application_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("id", application_id).execute()

    if not response.data:
        raise Exception(f"Application {application_id} does not exist.")

    response = supabase.table('APPLICATION').update({
        'accepted': 'A'
    }).eq('id', application_id).execute()

    return response.data


def reject_application(application_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("id", application_id).execute()

    if not response.data:
        raise Exception(f"Application {application_id} does not exist.")

    response = supabase.table('APPLICATION').update({
        'accepted': 'R'
    }).eq('id', application_id).execute()

    return response.data


def update_recruitment_round_status(round_id, new_status):
    # Check if the recruitment round exists
    existing_round = supabase.table('RECRUITMENT_ROUND').select(
        "*").eq("id", round_id).execute()
    if not existing_round.data:
        raise Exception(f"Recruitment round {round_id} does not exist.")

    # Update the status of the recruitment round
    response = supabase.table('RECRUITMENT_ROUND').update({
        "status": new_status
    }).eq("id", round_id).execute()

    return response.data
