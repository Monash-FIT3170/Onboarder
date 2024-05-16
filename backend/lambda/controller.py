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
    deadline, 
    semester, 
    year, 
    student_team_id, 
    status
):
    # status can only be (A)ctive or (I)nactive
    data = {
        "deadline": deadline,
        "semester": semester,
        "year": year,
        "student_team_id": student_team_id,
        "status": status
    }

    response = supabase.table('RECRUITMENT_ROUND').insert(data).execute()

    return response.data

def create_opening(
    recruitment_round_ID, 
    title, 
    description, 
    app_role, 
    status, 
    required_skills, 
    desired_skills
):
    # status can only be (A)ctive or (I)nactive
    data = {
        "recruitment_round_ID": recruitment_round_ID,
        "title": title,
        "description": description,
        "app_role": app_role,
        "status": status,
        "required_skills": required_skills,
        "desired_skills": desired_skills
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
        "skills": skills
    }
    response = supabase.table('APPLICATION').insert(data).execute()

    return response.data

# ---------------- ALL GETTER FUNCTIONS ----------------

# STUDENT TEAM GETTERS

def get_all_student_teams():
    response = supabase.table('STUDENT_TEAM').select("*").execute()
    return response.data

def get_specific_student_team(student_team_id):
    response = supabase.table('STUDENT_TEAM').select(
        "*").eq("id", student_team_id).execute()
    
    return response.data

# RECRUITMENT ROUND GETTERS

def get_all_rec_rounds():
    response = supabase.rpc('get_all_rec_rounds_with_openings_count').execute()
    return response.data

def get_specific_rec_round(round_id):
    response = supabase.table('RECRUITMENT_ROUND').select(
        "*").eq("id", round_id).execute()

    return response.data

# OPENINGS GETTERS

def get_all_openings():
    response = supabase.table('OPENING').select("*").execute()

    return response.data

def get_count_openings_for_rec_round(round_id):
    response = supabase.table('OPENING').select(
        "*").eq("recruitment_round_ID", round_id).execute()
    
    return response.count

def get_all_opens_for_round(round_id):
    response = supabase.table('OPENING').select(
        "*").eq("recruitment_round_ID", round_id).execute()

    return response.data

def get_specific_open_for_round(round_id, opening_id):
    response = supabase.table('OPENING').select(
        "*").eq("id", opening_id).eq("recruitment_round_ID", round_id).execute()

    return response.data

def get_all_applications_for_opening(opening_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("opening_id", opening_id).execute()

    return response.data

# APPLICATION GETTERS

def get_application(application_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("id", application_id).execute()

    return response.data

def accept_application(application_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("id", application_id).execute()
    
    if not response.data:
        raise f"applicantion with {application_id} doesnt exist"

    app_data = response.data[0]

    if app_data['accepted'] == 'A':
        raise f"applicantion with {application_id} was already accepted"
    
    elif app_data['accepted'] == 'R':
        raise f"applicantion with {application_id} was already rejected"

    else: 
        response = supabase.table('APPLICATION').update({
            'accepted': 'A'
        }).eq('id', application_id).execute()

        return response.data

def reject_application(application_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("id", application_id).execute()

    if not response.data:
        raise f"applicantion with {application_id} doesnt exist"

    app_data = response.data[0]

    if app_data['accepted'] == 'A':
        raise f"applicantion with {application_id} was already accepted"
    
    elif app_data['accepted'] == 'R':
        raise f"applicantion with {application_id} was already rejected"

    else: 
        response = supabase.table('APPLICATION').update({
            'accepted': 'A'
        }).eq('id', application_id).execute()

        return response.data