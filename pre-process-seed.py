import os
import shutil

def load_env(file_path='.env'):
    """Load environment variables from a file."""
    env_vars = {}
    try:
        with open(file_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env_vars[key.strip()] = value.strip().strip("'").strip('"')
    except FileNotFoundError:
        print(f"Warning: {file_path} not found. Proceeding with system environment variables.")
    return env_vars

# Load environment variables
env_vars = load_env()

# Define file paths
template_path = 'supabase/seed.sql.template'
output_path = 'supabase/seed.sql'

# Get the email from environment variables
email = env_vars.get("DEV_EMAIL") 

# Check if the email is set
if email is None:
    print("Error: DEV_EMAIL is not set in .env file or system environment variables")
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