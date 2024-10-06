from supabase import create_client, Client
import os
import smtplib
import ssl
from email.message import EmailMessage
from cryptography.fernet import Fernet  # type: ignore
import json
import sqs

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# -------------- ALL APPLICATION CONTROLLERS --------------


def get_all_applications():
    response = supabase.table("APPLICATION").select("*").execute()
    return response.data


def create_application(
    email,
    name,
    phone,
    semesters_until_completion,
    current_semester,
    major_enrolled,
    additional_info,
    skills,
    # created_at,
    # candidate_availability,
    # interview_date,
    # interview_notes,
    # interview_score,
    # status,
    opening_id,
    course_name
):
    response = supabase.table("APPLICATION").insert({
        "email": email,
        "name": name,
        "phone": phone,
        "semesters_until_completion": semesters_until_completion,
        "current_semester": current_semester,
        "major_enrolled": major_enrolled,
        "additional_info": additional_info,
        "skills": skills,
        # "created_at": created_at,
        # "candidate_availability": candidate_availability,
        # "interview_date": interview_date,
        # "interview_notes": interview_notes,
        # "interview_score": interview_score,
        # "status": status,
        "opening_id": opening_id,
        "course_name": course_name
    }).execute()

    return response.data


def get_all_applications_for_opening(opening_id):
    response = supabase.table("APPLICATION").select(
        "*").eq("opening_id", opening_id).execute()
    return response.data


def update_application(application_id, data):
    response = supabase.table("APPLICATION").update(
        data).eq("id", application_id).execute()
    return response.data


def get_application(application_id):
    response = supabase.table("APPLICATION").select(
        "*").eq("id", application_id).execute()
    return response.data


def delete_application(application_id):
    response = supabase.table("APPLICATION").delete().eq(
        "id", application_id).execute()
    return response.data


# -------------- ALL TEAM LEAD APPLICATION ASSIGNMENT CONTROLLERS --------------

def get_team_lead_for_student_team(student_team_id):
    response = supabase.table("allocated_members_for_student_team").select(
        "*").eq("student_team_id", student_team_id).execute()
    return response.data


def assign_team_lead_to_opening(opening_id, profile_id):
    response = supabase.table("TEAM_LEAD_ASSIGNMENT").insert(
        {"opening_id": opening_id, "profile_id": profile_id}).execute()
    return response.data


def get_team_lead_for_opening(opening_id):
    response = supabase.table("allocated_members_for_student_team").select(
        "*").eq("opening_id", opening_id).execute()
    return response.data


def get_team_lead_opening_assignment_status(opening_id, profile_id):
    response = supabase.table("TEAM_LEAD_ASSIGNMENT").select(
        "*").eq("opening_id", opening_id).eq("profile_id", profile_id).execute()
    # return len(response.data) > 0
    return response.data


def remove_team_lead_from_opening(opening_id, profile_id):
    response = supabase.table("TEAM_LEAD_ASSIGNMENT").delete().eq(
        "opening_id", opening_id).eq("profile_id", profile_id).execute()
    return response.data


# -------------- ALL OPENING CONTROLLERS --------------

def get_all_openings():
    response = supabase.table(
        "openings_with_application_count").select("*").execute()
    return response.data


def create_opening(
        recruitment_round_id,
        title,
        description,
        status,
        required_skills,
        desired_skills,
        task_email_format,
        task_enabled

):
    response = supabase.table("OPENING").insert({
        "recruitment_round_id": recruitment_round_id,
        "title": title,
        "description": description,
        "status": status,
        "required_skills": required_skills,
        "desired_skills": desired_skills,
        "task_email_format": task_email_format,
        "task_enabled": task_enabled,

    }).execute()

    return response.data


def get_all_openings_for_recruitment_round(round_id):
    response = supabase.table("openings_with_application_count").select(
        "*").eq("recruitment_round_id", round_id).execute()
    return response.data


def update_opening(opening_id, data):
    response = supabase.table("OPENING").update(
        data).eq("id", opening_id).execute()
    return response.data


def get_opening(opening_id):
    response = supabase.table("openings_with_application_count").select(
        "*").eq("id", opening_id).execute()
    return response.data


def delete_opening(opening_id):
    # Delete related entries in TEAM_LEAD_ASSIGNMENT
    remove_team_lead_from_opening(opening_id)

    # Delete related entries in APPLICATION
    applications = get_all_applications_for_opening(opening_id)

    for application in applications:
        delete_application(application["id"])

    # Finally, delete the opening
    response = supabase.table("OPENING").delete().eq(
        "id", opening_id).execute()
    return response.data


def schedule_interviews(opening_id):
    print('(Controller) Scheduling interviews for opening:', opening_id)
    body = {'opening_id': opening_id}

    local = os.environ.get('INTERVIEW_SCHEDULER_QUEUE_URL')
    if local == "":
        print('Running locally')
        import optimisation
        event = json.dumps({'Records': [{'body': {'opening_id': opening_id}}]})
        optimisation.lambda_handler(event, {})
    else:
        print('Running on AWS')
        sqs.post(body)


# -------------- ALL RECRUITMENT ROUND CONTROLLERS --------------

def get_all_recruitment_rounds():
    response = supabase.table(
        "rec_rounds_with_openings_count").select("*").execute()
    return response.data


def create_recruitment_round(student_team_id, semester, year, application_deadline, interview_preference_deadline, interview_period, status):
    response = supabase.table("RECRUITMENT_ROUND").insert({
        "student_team_id": student_team_id,
        "semester": semester,
        "year": year,
        "application_deadline": application_deadline,
        "interview_preference_deadline": interview_preference_deadline,
        "interview_period": interview_period,
        "status": status
    }).execute()

    return response.data


def get_all_recruitment_rounds_for_student_team(student_team_id):
    response = supabase.table("rec_rounds_with_openings_count").select(
        "*").eq("student_team_id", student_team_id).execute()
    return response.data


def update_recruitment_round(recruitment_round_id, data):
    response = supabase.table("RECRUITMENT_ROUND").update(
        data).eq("id", recruitment_round_id).execute()

    if "status" in data:
        # update the status of all openings in the recruitment round
        supabase.table("OPENING").update({"status": data["status"]}).eq(
            "recruitment_round_id", recruitment_round_id).execute()

    return response.data


def get_recruitment_round(recruitment_round_id):
    response = supabase.table("rec_rounds_with_openings_count").select(
        "*").eq("id", recruitment_round_id).execute()
    return response.data


def delete_recruitment_round(recruitment_round_id):
    # Delete related entries in OPENING
    openings = get_all_openings_for_recruitment_round(recruitment_round_id)

    for opening in openings:
        delete_opening(opening["id"])

    # Finally, delete the recruitment round
    response = supabase.table("RECRUITMENT_ROUND").delete().eq(
        "id", recruitment_round_id).execute()
    return response.data


# -------------- ALL STUDENT TEAM MEMBER CONTROLLERS --------------

def add_member_to_student_team(student_team_id, email, role):
    # first check if the profile exists
    response = supabase.table("PROFILE").select(
        "*").eq("email", email).execute()

    if not response.data:
        # create the profile without user_id
        response = supabase.table("PROFILE").insert({"email": email}).execute()

    profile_id = response.data[0]["id"]

    # check if the member is already in the team
    response = supabase.table("PROFILE_TEAM_INFO").select(
        "*").eq("student_team_id", student_team_id).eq("profile_id", profile_id).execute()

    if response.data:
        return {"error": "Member already in team"}

    response = supabase.table("PROFILE_TEAM_INFO").insert(
        {"student_team_id": student_team_id, "profile_id": profile_id, "role": role}).execute()

    # Send welcome email
    team_response = supabase.table("STUDENT_TEAM").select(
        "name").eq("id", student_team_id).execute()
    team_name = team_response.data[0]["name"]

    send_welcome_email(email, team_name, role)

    return response.data


def get_all_members_of_student_team(student_team_id):
    response = supabase.table("PROFILE_TEAM_INFO").select(
        "*").eq("student_team_id", student_team_id).execute()
    return response.data


def update_student_team_member(student_team_id, profile_id, data):
    response = supabase.table("PROFILE_TEAM_INFO").update(data).eq(
        "student_team_id", student_team_id).eq("profile_id", profile_id).execute()
    return response.data


def get_student_team_member(student_team_id, profile_id):
    response = supabase.table("PROFILE_TEAM_INFO").select(
        "*").eq("student_team_id", student_team_id).eq("profile_id", profile_id).execute()
    return response.data


def remove_member_from_student_team(student_team_id, profile_id):
    # Remove team lead assignments for the member in the given student team
    openings = supabase.table("PROFILE_TEAM_INFO").select(
        "id").eq("student_team_id", student_team_id).execute()

    for opening in openings.data:
        remove_team_lead_from_opening(opening["id"], profile_id)

    # Update applications to remove the profile_id
    applications = supabase.table("APPLICATION").select(
        "id").eq("profile_id", profile_id).execute()

    for application in applications.data:
        update_application(application["id"], {"profile_id": None})

    # Delete the member from PROFILE_TEAM_INFO
    response = supabase.table("PROFILE_TEAM_INFO").delete().eq(
        "student_team_id", student_team_id).eq("profile_id", profile_id).execute()
    return response.data


# -------------- ALL STUDENT TEAM CONTROLLERS --------------

def create_student_team(name, description):
    response = supabase.table("STUDENT_TEAM").insert(
        {"name": name, "description": description}).execute()
    return response.data


def get_all_student_teams():
    response = supabase.table("STUDENT_TEAM").select("*").execute()
    return response.data


def update_student_team(student_team_id, data):
    response = supabase.table("STUDENT_TEAM").update(
        data).eq("id", student_team_id).execute()
    return response.data


def get_student_team(student_team_id):
    response = supabase.table("STUDENT_TEAM").select(
        "*").eq("id", student_team_id).execute()
    return response.data


def delete_student_team(student_team_id):
    # Delete related entries in PROFILE_TEAM_INFO
    supabase.table("PROFILE_TEAM_INFO").delete().eq(
        "student_team_id", student_team_id).execute()

    # Delete related entries in RECRUITMENT_ROUND
    recruitment_rounds = get_all_recruitment_rounds_for_student_team(
        student_team_id)

    for rec_round in recruitment_rounds:
        # Delete related entries in OPENING
        openings = get_all_openings_for_recruitment_round(rec_round["id"])

        for opening in openings:
            # Delete the opening (which will also handle related TEAM_LEAD_ASSIGNMENT and APPLICATION entries)
            delete_opening(opening["id"])

        # Delete the recruitment round
        delete_recruitment_round(rec_round["id"])

    # Finally, delete the student team
    response = supabase.table("STUDENT_TEAM").delete().eq(
        "id", student_team_id).execute()
    return response.data


# -------------- ALL PROFILE CONTROLLERS --------------

def create_profile(user_id, email):
    response = supabase.table("PROFILE").insert(
        {"user_id": user_id, "email": email}).execute()
    return response.data


def get_all_profiles():
    response = supabase.table("PROFILE").select("*").execute()
    return response.data


def update_profile(profile_id, data):
    response = supabase.table("PROFILE").update(
        data).eq("id", profile_id).execute()
    return response.data


def get_profile(profile_id):
    response = supabase.table("PROFILE").select(
        "*").eq("id", profile_id).execute()
    return response.data


def delete_profile(profile_id):
    # Remove the member from all student teams
    student_teams = get_all_members_of_student_team(profile_id)

    for team in student_teams:
        remove_member_from_student_team(team["student_team_id"], profile_id)

    # Finally, delete the profile
    response = supabase.table("PROFILE").delete().eq(
        "id", profile_id).execute()
    return response.data


def get_student_teams_for_profile(profile_id):
    response = supabase.table("student_teams_with_roles_and_owners").select(
        "*").eq("profile_id", profile_id).execute()
    return response.data


def get_interviews_for_profile(profile_id):
    """
    Retrieves interview details for a given profile ID from the "APPLICATION" table.

    Args:
        profile_id (str): The profile id of the user (interviewer)

    Returns:
        list: A list of dictionaries containing the corresponding interview details (name, email, interview_date).
    """
    response = supabase.table("APPLICATION").select(
        "name, email, interview_date").eq("profile_id", profile_id).execute()
    return response.data


# -------------- EMAIL CONTROLLERS --------------

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


def send_email(recipient_email, subject, body):
    email_sender = os.environ.get('EMAIL_SENDER')
    smtp_host = os.environ.get('SMTP_HOST')
    smtp_port = os.environ.get('SMTP_PORT')
    smtp_username = os.environ.get('SMTP_USERNAME')
    smtp_password = os.environ.get('SMTP_PASSWORD')

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL(smtp_host, smtp_port, context=context) as smtp:
            smtp.login(smtp_username, smtp_password)

            em = EmailMessage()
            em['From'] = email_sender
            em['To'] = recipient_email
            em['Subject'] = subject
            em.add_alternative(body, subtype='html')

            smtp.send_message(em)
            print(f"Email sent successfully to {recipient_email}")
            return True
    except smtplib.SMTPAuthenticationError:
        print("Authentication failed. Please check your email and password.")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {str(e)}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")
    return False


def send_bulk_email(recipients, task_enabled, task_email_format):
    subject = "Next Steps in Your Application Process - Action Required"

    for recipient in recipients:
        body = generate_email_body(
            recipient['application_id'], task_enabled, task_email_format)
        send_email(recipient['email'], subject, body)

    print("All emails sent successfully")


def send_interview_email(opening_id):
    applicants = get_all_applications_for_opening(opening_id)

    recipients = []

    for applicant in applicants:
        # If applicant is a candidate
        if applicant["status"] == "C":
            recipients.append(
                {"email": applicant['email'], "application_id": applicant["id"]})

    if recipients:
        response = get_opening(opening_id)

        task_enabled = response[0]['opening_task_enabled']
        task_email_format = response[0]['opening_task_email_format']

        send_bulk_email(recipients, task_enabled, task_email_format)

    return recipients


def decrypt_id(encrypted_id):
    try:
        decrypted_id = fernet.decrypt(encrypted_id.encode()).decode()
        application_data = get_application(decrypted_id)
        round_data = get_interview_preference_deadline_from_application_id(
            decrypted_id)
        interview_preference_deadline_data = get_interview_preference_deadline_from_application_id(
            decrypted_id)

        return {
            'decrypted_id': decrypted_id,
            'candidate_availability': application_data[0].get('candidate_availability', []),
            'interview_preference_deadline': interview_preference_deadline_data
        }

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None


def get_interview_preference_deadline_from_application_id(application_id):
    try:
        opening = supabase.table("APPLICATION").select(
            "opening_id").eq("id", application_id).execute()
        round = supabase.table("openings_with_application_count").select(
            "recruitment_round_id").eq("id", opening.data[0]['opening_id']).execute()
        preference_deadline = supabase.table("RECRUITMENT_ROUND").select(
            "interview_preference_deadline").eq("id", round.data[0]['recruitment_round_id']).execute()

        return preference_deadline.data[0]['interview_preference_deadline']

    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return None


def send_welcome_email(email, team_name, role):
    role_mapping = {
        'O': 'Owner',
        'A': 'Admin',
        'T': 'Team Lead'
    }
    new_role = role_mapping.get(role, 'Team Member')
    website_url = os.environ.get('WEBSITE_URL')

    subject = f"Welcome to {team_name}! 🎉"
    body = f"""
    <html>
    <body>
    <p>Hello and welcome!</p>
    <p>We're thrilled to have you join our amazing student team "{team_name}" as our new {new_role}! 🌟</p>
    <p>If you have any questions or ideas, please don't hesitate to reach out to your admin.</p>
    <p>To get started, please log in using your Monash email:</p>
    <p><a href="{website_url}/login">Log in with Monash Email</a></p>
    <p>Once again, welcome aboard! Let's make some magic happen! ✨</p>
    <p>Warm regards,<br>{team_name}</p>
    </body>
    </html>
    """

    email_sent = send_email(email, subject, body)

    if email_sent:
        print(f"Notification email sent to {email}")
    else:
        print(f"Failed to send notification email to {email}")

    return email_sent
