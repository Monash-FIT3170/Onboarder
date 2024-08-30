# Onboarder

Recruitment platform for Monash University student teams

## Table of Contents

- [Onboarder](#onboarder)
  - [Table of Contents](#table-of-contents)
  - [Team Members](#team-members)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
    - [Back-end Setup](#back-end-setup)
    - [Front-end Setup](#front-end-setup)
  - [Database Setup (Supabase)](#database-setup-supabase)
    - [Google Sign-In Setup](#google-sign-in-setup)
  - [Configuration Files](#configuration-files)
      - [`.env` (Front-end)](#env-front-end)
      - [`env.json` (Back-end)](#envjson-back-end)
      - [Email Configuration](#email-configuration)
      - [Supabase Configuration](#supabase-configuration)
      - [Encryption Key](#encryption-key)
  - [Additional Notes](#additional-notes)
  - [Common Issues](#common-issues)

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ahmadhafiz17"><img src="https://avatars.githubusercontent.com/u/140464163?v=4?s=100" width="100px;" alt="ahmadhafiz17"/><br /><sub><b>ahmadhafiz17</b></sub></a><br /><a href="#code-ahmadhafiz17" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Prerequisites

To run this project, you'll need the following software and hardware:

- Docker
- AWS CLI
- AWS SAM CLI
- Python 3.12
- NodeJS (v20.6.1 recommended if the latest version doesn't work)
- .env and env.json files (details below)
- Supabase account

## Setup Instructions

### Back-end Setup

1. Install Docker, AWS CLI, AWS SAM CLI, and Python 3.12.
2. Add the `env.json` file to the root folder (see configuration details below).
3. Keep Docker running in the background.
4. Open a terminal in the root folder and execute:
   ```
   sam build
   ```
5. After completion, run:
   ```
   sam local start-api --warm-containers EAGER --env-vars env.json
   ```

### Front-end Setup

1. Install NodeJS (v20.6.1 if the latest version doesn't work).
2. Add the `.env` file to the front-end folder (see configuration details below).
3. Open a terminal in the front-end folder:
   ```
   cd front-end
   ```
4. Install dependencies:
   ```
   npm install
   ```
5. If any packages have security issues, run:
   ```
   npm audit fix
   ```
   (Note: Use discretion as this might introduce breaking changes)
6. Start the development server:
   ```
   npm run dev
   ```
7. Navigate to `http://localhost:5173/` in your browser.
8. Sign in with your Monash account.

## Database Setup (Supabase)

We use Supabase for the database and the Supabase JavaScript SDK for frontend authentication and sign-in with Google.

1. Sign up for a Supabase account.
2. In your Supabase project, run the following SQL scripts located in `/backend/schema` directory:
   - `schema.sql`: Sets up the database tables
   - `auth_function.sql`: Sets up authentication functions
   - (Optional) `dummy_values.sql`: Seeds the database with test values

To reset the tables, you can rerun `schema.sql` and `auth_function.sql`.

### Google Sign-In Setup

To enable sign-in with Google follow the steps outlined in this [Youtube Video](https://www.youtube.com/watch?v=dE2vtnv83Fc)

## Configuration Files

#### `.env` (Front-end)

Update this file with your Supabase details found in your Supabase project settings:

```
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_KEY=YOUR_SUPABASE_KEY
```

#### `env.json` (Back-end)

The `env.json` file in the root folder contains crucial configuration settings for the back-end, including email settings, database connections, and encryption keys. Here's a breakdown of its structure and how to set it up:

```json
{
    "RouterLambda": {
        "EMAIL_SENDER": "YOUR_EMAIL@GMAIL.COM",
        "SMTP_HOST": "smtp.gmail.com",
        "SMTP_PORT": 465,
        "SMTP_USERNAME": "YOUR_EMAIL@GMAIL.COM",
        "SMTP_PASSWORD": "YOUR_SMTP_PASSWORD",
        "SUPABASE_URL": "YOUR_SUPABASE_URL",
        "SUPABASE_KEY": "YOUR_SUPABASE_KEY",
        "ENCRYPTION_KEY": "YOUR_ENCRYPTION_KEY"
    }
}
```

#### Email Configuration
- `EMAIL_SENDER`: The email address used to send notifications.
- `SMTP_HOST`, `SMTP_PORT`: SMTP server settings (example shows Gmail's settings).
- `SMTP_USERNAME`: Usually the same as `EMAIL_SENDER`.
- `SMTP_PASSWORD`: For Gmail, use an App Password. [This video guide](https://www.youtube.com/watch?v=g_j6ILT-X0k&t=125s) explains how to generate one.

Note: While we use Gmail as an example, you can configure any SMTP provider by updating these values accordingly.

#### Supabase Configuration

- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_KEY`: Your Supabase project API key.

These can be found in your Supabase project settings.

#### Encryption Key

The `ENCRYPTION_KEY` is used to encrypt sensitive data, such as application IDs in emails. Generate it once using the Fernet library in Python:

```python
from cryptography.fernet import Fernet  

# Generate a key (do this only once and store it securely)  
key = Fernet.generate_key()  
print(key.decode())  # This prints the key as a string
```

Run this script once, save the output, and use it as your `ENCRYPTION_KEY` in the `env.json` file.

Important: Keep your `env.json` file and especially the `ENCRYPTION_KEY` secure. Never commit them to version control or share them publicly.

## Additional Notes

- Ensure all configuration files (.env and env.json) are properly set up before running the project.
- If you encounter issues with the latest NodeJS version, try using v20.6.1.
- For any SMTP provider other than Gmail, update the SMTP settings in `env.json` accordingly.

## Common Issues

[Any additional notes or common issues that future developers might benefit from knowing]