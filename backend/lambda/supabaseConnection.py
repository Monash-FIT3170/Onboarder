from supabase import create_client, Client
import os

# Set an environment variable
os.environ["SUPABASE_URL"] = "https://bcnxifsqkyzzpgshacts.supabase.co"
os.environ["SUPABASE_KEY"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbnhpZnNxa3l6enBnc2hhY3RzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU1NjM5NjQsImV4cCI6MjAzMTEzOTk2NH0.XT_aSkBLaaaX-66BqDF7Z1oP5qlgJLGNXSovibjatdU"


url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


response = supabase.table('RECRUITMENT_ROUND').select("*").execute()

print(response)

"""
data=[
    {'id': 1, 'semester': 'Spring', 'year': '2024-01-01', 'student_team_id': 1, 'status': 'open'}, 
    {'id': 2, 'semester': 'Fall', 'year': '2023-09-01', 'student_team_id': 2, 'status': 'closed'}, 
    {'id': 3, 'semester': 'Spring', 'year': '2023-01-01', 'student_team_id': 3, 'status': 'open'}, 
    {'id': 4, 'semester': 'Fall', 'year': '2022-09-01', 'student_team_id': 4, 'status': 'closed'}, 
    {'id': 5, 'semester': 'Spring', 'year': '2022-01-01', 'student_team_id': 5, 'status': 'open'}
    ]
"""
