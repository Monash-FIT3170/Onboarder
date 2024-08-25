from supabase import create_client, Client
import os
import smtplib
import ssl
from email.message import EmailMessage
from cryptography.fernet import Fernet # type: ignore

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# ---------------- ALL SETTER FUNCTIONS ----------------


def create_student_team(
    name,
    description
):
    data = {
        "name": name,
        "description": description
    }

    response = supabase.table('STUDENT_TEAM').insert(data).execute()

    return response.data

def delete_student_team(student_team_id):
    response = supabase.table('STUDENT_TEAM').delete().eq("id", student_team_id).execute()
    return response.data

def add_profile_team_info(email, student_team_id, role):
    try:
        # Get the profile ID based on the email
        profile_response = supabase.table('PROFILE').select('id').eq('email', email).execute()
        profile_id = profile_response.data[0]['id']

        data = {
            "profile_id": profile_id,
            "student_team_id": student_team_id,
            "role": role
        }

        # Insert the profile team info
        response = supabase.table('PROFILE_TEAM_INFO').insert(data).execute()
        return response.data
    except Exception as e:
        print(e)
        return {"error": str(e)}
    
def update_availability(profileId, availability):
    data = {
        "interview_availability": availability
    }

    try:
        response = supabase.table('PROFILE').update(data).eq("id", profileId).execute()
        return response.data
    except Exception as e:
        print(e)
        return {"error": str(e)}


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

def allocate_member_to_opening(opening_id, profile_id):
    data = {
        "opening_id": opening_id,
        "profile_id": profile_id
    }

    response = supabase.table('TEAM_LEAD_ASSIGNMENT').insert(data).execute()

    return response.data

def update_opening(opening_id, data):
    response = supabase.table('OPENING').update(data).eq("id", opening_id).execute()

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

def get_availability(profileId):
    try:
        response = supabase.table('PROFILE').select("interview_availability").eq("id", profileId).execute()
        return response.data
    except Exception as e:
        print(e)
        return {"error": str(e)}

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

def get_all_members_of_student_team(student_team_id):
    response = supabase.table('PROFILE_TEAM_INFO') \
        .select("*") \
        .eq("student_team_id", student_team_id) \
        .execute()

    return response.data

def get_allocated_members_for_student_team(student_team_id):
    response = supabase.rpc('get_allocated_members_for_student_team') \
        .select("*") \
        .eq("student_team_id", student_team_id) \
        .execute()

    return response.data

def get_rec_rounds_for_student_team(student_team_id):
    response = supabase.table('RECRUITMENT_ROUND') \
        .select("*") \
        .eq("student_team_id", student_team_id) \
        .execute()

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
    response = supabase.table('APPLICATION') \
        .select("*") \
        .eq("id", application_id) \
        .execute()

    if response.data:
        profile_id = response.data[0]['profile_id']
        profile_response = supabase.table('PROFILE') \
            .select('email') \
            .eq('id', profile_id) \
            .execute()
        if profile_response.data:
            response.data[0]['profile_email'] = profile_response.data[0]['email']

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

def update_application(application_id, data):
    response = supabase.table('APPLICATION').update(data).eq("id", application_id).execute()

    return response.data

# ---------------- ALL EMAIL FUNCTIONS ----------------


encryption_key = os.environ.get('ENCRYPTION_KEY')
fernet = Fernet(encryption_key)


def encrypt_application_id(application_id):
    """
    Function to encrypt the application_id
    """
    encrypted_id = fernet.encrypt(str(application_id).encode())
    return encrypted_id.decode()


def generate_email_body(application_id):
    """
    Function to generate the email body
    """
    encrypted_id = encrypt_application_id(application_id)

    return f"""
    <html>
        <body>
            <h1>Next Steps in Your Application Process - Action Required</h1>
            <p>Dear Candidate,</p>
            <p>Congratulations on progressing to the next stage of our recruitment process. We're impressed with your application and look forward to learning more about you.</p>
            <p>To move forward, please provide your availability for the next steps by clicking on the following link:
            <a href="http://localhost:5173/availability-calendar/{encrypted_id}">Enter Availability</a>.
            We kindly ask that you complete this within the next 3 business days.</p>
            <p>If you have any questions about the process or require any accommodations, please don't hesitate to reach out.</p>
            <p>We look forward to speaking with you soon.</p>
            <p>Best regards,<br>Team Name</p>
        </body>
    </html>
    """


def send_bulk_email(recipients):
    email_sender = os.environ.get('EMAIL_SENDER')
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = os.environ.get('SMTP_PORT')
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')

    context = ssl.create_default_context()

    subject = "Next Steps in Your Application Process - Action Required"

    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as smtp:
            smtp.login(smtp_username, smtp_password)

            for recipient in recipients:
                em = EmailMessage()
                em['From'] = email_sender
                em['To'] = recipient['email']
                em['Subject'] = subject

                body = generate_email_body(recipient['application_id'])
                em.add_alternative(body, subtype='html')

                smtp.send_message(em)
                print(f"Email sent successfully to {recipient}")

        print("All emails sent successfully")
    except smtplib.SMTPAuthenticationError:
        print("Authentication failed. Please check your email and password.")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {str(e)}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")


def send_interview_email(opening_id):
    openings = get_all_applications_for_opening(opening_id)

    recipients = []

    for opening in openings:
        # If applicant is a candidate
        if opening["status"] == "C":
            recipients.append(
                {"email": opening['email'], "application_id": opening["id"]})

    if recipients:
        send_bulk_email(recipients)

    return recipients


def decrypt_id(encrypted_id):
    try:
        decrypted_id = fernet.decrypt(encrypted_id.encode()).decode()
        application_data = get_application(decrypted_id)

        return {
            'decrypted_id': decrypted_id,
            'candidate_availability': application_data[0].get('candidate_availability', [])
        }

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None


def update_availability(applicationId, candidate_availablity):
    response = supabase.table('APPLICATION').update({
        'candidate_availability': candidate_availablity
    }).eq('id', applicationId).execute()

    return response.data
