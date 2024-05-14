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
    response = supabase.table('OPENING').select("*").execute()
    data = response.data
    return data


def get_specific_open_for_round(round_id, opening_id):
    response = supabase.table('OPENING').select(
        "*").eq("id", opening_id).eq("recruitment_round_ID", round_id).execute()

    data = response.data
    return data


def get_all_opens_for_round(round_id):
    response = supabase.table('OPENING').select(
        "*").eq("recruitment_round_ID", round_id).execute()

    data = response.data
    return data


def create_opening():
    return 1


def create_application():
    return 1


def get_all_applications_for_opening(opening_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("opening_id", opening_id).execute()

    data = response.data
    return data


def get_application(application_id):
    response = supabase.table('APPLICATION').select(
        "*").eq("id", application_id).execute()

    data = response.data
    return data


def accept_application():
    return 1


def reject_application():
    return 1
