import os
import shutil
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Define file paths
template_path = 'supabase/seed.sql.template'
output_path = 'supabase/seed.sql'

# Get the email from environment variable
email = os.getenv("DEV_EMAIL")

# Check if the email is set
if email is None:
    print("Error: DEV_EMAIL is not set in .env file")
    exit(1)

# Copy template to new file
shutil.copy(template_path, output_path)

# Read the content of the new file
with open(output_path, 'r') as file:
    content = file.read()

# Replace placeholders with environment variables
content = content.replace('DEV_EMAIL', email)

# Write the updated content back to the file
with open(output_path, 'w') as file:
    file.write(content)

print(f"Generated {output_path} from {template_path} with environment variables")
print(f"Using email: {email}")