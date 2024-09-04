from supabase import create_client, Client
import os
import smtplib
import ssl
from email.message import EmailMessage
from cryptography.fernet import Fernet # type: ignore

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


# -------------- ALL PROFILE CONTROLLERS --------------

def create_profile(user_id, email):
    raise NotImplementedError

def get_all_profiles():
    response = supabase.table("PROFILE").select("*").execute()
    return response.data

def update_profile(profile_id, data):
    response = supabase.table("PROFILE").update(data).eq("id", profile_id).execute()
    return response.data

def get_profile(profile_id):
    response = supabase.table("PROFILE").select("*").eq("id", profile_id).execute()
    return response.data

def delete_profile(profile_id):
    response = supabase.table("PROFILE").delete().eq("id", profile_id).execute()
    return {"success": True}


# -------------- ALL STUDENT TEAM CONTROLLERS --------------

def create_student_team(name, description):
    raise NotImplementedError

def get_all_student_teams():
    response = supabase.table("STUDENT_TEAM").select("*").execute()
    return response.data

def update_student_team(student_team_id, data):
    response = supabase.table("STUDENT_TEAM").update(data).eq("id", student_team_id).execute()
    return response.data

def get_student_team(student_team_id):
    response = supabase.table("STUDENT_TEAM").select("*").eq("id", student_team_id).execute()
    return response.data

def delete_student_team(student_team_id):
    response = supabase.table("STUDENT_TEAM").delete().eq("id", student_team_id).execute()
    return {"success": True}


# -------------- ALL STUDENT TEAM MEMBER CONTROLLERS --------------

def add_member_to_student_team(student_team_id, email, role):
    raise NotImplementedError

def get_all_members_of_student_team(student_team_id):
    response = supabase.table("PROFILE_TEAM_INFO").select("*").eq("student_team_id", student_team_id).execute()
    return response.data

def update_student_team_member(student_team_id, profile_id, data):
    response = supabase.table("PROFILE_TEAM_INFO").update(data).eq("student_team_id", student_team_id).eq("profile_id", profile_id).execute()
    return response.data

def get_student_team_member(student_team_id, profile_id):
    response = supabase.table("PROFILE_TEAM_INFO").select("*").eq("student_team_id", student_team_id).eq("profile_id", profile_id).execute()
    return response.data

def remove_member_from_student_team(student_team_id, profile_id):
    response = supabase.table("PROFILE_TEAM_INFO").delete().eq("student_team_id", student_team_id).eq("profile_id", profile_id).execute()
    return {"success": True}


# -------------- ALL RECRUITMENT ROUND CONTROLLERS --------------

def get_all_recruitment_rounds():
    response = supabase.table("RECRUITMENT_ROUND").select("*").execute()
    return response.data

def create_recruitment_round(student_team_id, semester, year, deadline, status):
    raise NotImplementedError

def get_all_recruitment_rounds_for_student_team(student_team_id):
    response = supabase.table("RECRUITMENT_ROUND").select("*").eq("student_team_id", student_team_id).execute()
    return response.data

def update_recruitment_round(recruitment_round_id, data):
    response = supabase.table("RECRUITMENT_ROUND").update(data).eq("id", recruitment_round_id).execute()
    return response.data

def get_recruitment_round(recruitment_round_id):
    response = supabase.table("RECRUITMENT_ROUND").select("*").eq("id", recruitment_round_id).execute()
    return response.data

def delete_recruitment_round(recruitment_round_id):
    response = supabase.table("RECRUITMENT_ROUND").delete().eq("id", recruitment_round_id).execute()
    return {"success": True}


# -------------- ALL OPENING CONTROLLERS --------------

def get_all_openings():
    response = supabase.table("OPENING").select("*").execute()
    return response.data

def create_opening(
        recruitment_round_id, 
        title, 
        description, 
        task_enabled, 
        task_email_format
    ):
    raise NotImplementedError

def get_all_openings_for_recruitment_round(round_id):
    response = supabase.table("OPENING").select("*").eq("recruitment_round_id", round_id).execute()
    return response.data

def update_opening(opening_id, data):
    response = supabase.table("OPENING").update(data).eq("id", opening_id).execute()
    return response.data

def get_opening(opening_id):
    response = supabase.table("OPENING").select("*").eq("id", opening_id).execute()
    return response.data

def delete_opening(opening_id):
    response = supabase.table("OPENING").delete().eq("id", opening_id).execute()
    return {"success": True}


# -------------- ALL TEAM LEAD APPLICATION ASSIGNMENT CONTROLLERS --------------

def assign_team_lead_to_opening(opening_id, profile_id):
    raise NotImplementedError

def get_team_lead_for_opening(opening_id):
    raise NotImplementedError

def remove_team_lead_from_opening(opening_id):
    raise NotImplementedError


# -------------- ALL APPLICATION CONTROLLERS --------------

def get_all_applications():
    raise NotImplementedError

def create_application(
        email, 
        name, 
        phone, 
        semesters_until_completion, 
        current_semester, 
        major_enrolled, 
        additional_info, 
        skills, 
        created_at, 
        candidate_availability, 
        interview_date, 
        interview_notes, 
        interview_score, 
        status, 
        opening_id
    ):
    raise NotImplementedError

def get_all_applications_for_opening(opening_id):
    raise NotImplementedError

def update_application(application_id, data):
    raise NotImplementedError

def get_application(application_id):
    raise NotImplementedError

def delete_application(application_id):
    raise NotImplementedError

# -------------- MISC CONTROLLERS --------------

encryption_key = os.environ.get('ENCRYPTION_KEY')
fernet = Fernet(encryption_key)


def encrypt_application_id(application_id):
    """
    Function to encrypt the application_id
    """
    encrypted_id = fernet.encrypt(str(application_id).encode())
    return encrypted_id.decode()


def generate_email_body(application_id, task_enabled=False, task_email_format=""):
    """
    Function to generate the email body
    """
    encrypted_id = encrypt_application_id(application_id)

    body = f"""
    <html>
        <body>
            <h2>Next Steps in Your Application Process - Action Required</h2>
            <p>Dear Candidate,</p>
            <p>Congratulations on progressing to the next stage of our recruitment process. We're impressed with your application and look forward to learning more about you.</p>
            <p>To move forward, please provide your availability for the next steps by clicking on the following link:
            <a href="http://localhost:5173/availability-calendar/{encrypted_id}">Enter Availability</a>.
            We kindly ask that you complete this within the next 3 business days.</p>
            <p>If you have any questions about the process or require any accommodations, please don't hesitate to reach out.</p>
    """

    if task_enabled and task_email_format:
        body += """
            <p>Additionally, you have been assigned a task that must be completed before the interview. Please reply to this email with your completed task.</p>
        """

        body += f"<p>{task_email_format}</p>"

    body += """
        <p>We look forward to speaking with you soon.</p>
        <p>Best regards,<br>Onboarder</p>
        
        </body>
    </html>
    """

    return body


def send_bulk_email(recipients, task_enabled, task_email_format):
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

                body = generate_email_body(
                    recipient['application_id'], task_enabled, task_email_format)
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
    applicants = get_all_applications(opening_id)

    recipients = []

    for applicant in applicants:
        # If applicant is a candidate
        if applicant["status"] == "C":
            recipients.append(
                {"email": applicant['email'], "application_id": applicant["id"]})

    if recipients:
        response = get_opening(opening_id)

        task_enabled = response.data['task_enabled']
        task_email_format = response.data['task_email_format']

        send_bulk_email(recipients, task_enabled, task_email_format)

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
