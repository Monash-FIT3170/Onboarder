# Onboarder

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

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
  - [Git Management](#git-management)
    - [Repository Structure](#repository-structure)
    - [Commit Guidelines](#commit-guidelines)
    - [Branch Management](#branch-management)
    - [Merge Requests](#merge-requests)

## Team Members

Below are the details of our team members, including their roles and Monash email addresses:

| Member                   | Monash Email                |
| ------------------------ | --------------------------- |
| Hanif Zafari (SA)        | hmoh0035@student.monash.edu |
| Anthony Razzell (SA)     | araz0013@student.monash.edu |
| Rahul Saxena (SA)        | rsax0001@student.monash.edu |
| Fahad Assadi (RTE)       | fass0001@student.monash.edu |
| Rahul Sahni (RTE)        | rsah0008@student.monash.edu |
| Umair Mohammad (RTE)     | umoh0005@student.monash.edu |
| Tran Ngo (RTE)           | tngo0031@student.monash.edu |
| Nguyen Khang (RTE)       | nhuy0018@student.monash.edu |
| Ranith Pathiranage (RTE) | rsim0010@student.monash.edu |
| Shubh Bajpai (PO)        | sbaj0015@student.monash.edu |
| Sai Rami (PO)            | sram0056@student.monash.edu |
| Tavishi Saxena (PO)      | tsax0001@student.monash.edu |
| Ahmed Hafiz (PO)         | abin0036@student.monash.edu |
| Jesse Cruickshank (PO)   | jcru0005@student.monash.edu |
| Brendon Perera (PO)      | bper0009@student.monash.edu |

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

### Front-end Setup

1. Install NodeJS (v20.6.1 if the latest version doesn't work).
2. Add the second `.env` file to the front-end folder (see configuration details below).
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
7. Navigate to `http://127.0.0.1:5173/` in your browser. (**NOT localhost:5173**)
8. Sign in with your Monash account.

### Back-end Setup

#### Sam

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

#### Supabase Local Development

1. Add the `.env` file to the root folder (see configuration details below).
2. Keep Docker running in the background.
3. Ensure Docker is configured as here: [Supabase Docs: Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
3. Open a terminal in the root folder and execute:
   ```
   supabase start
   ```
   (This may take a while the first time.)
   You may need to run `npx supabase start` if it does not work
4. After completion, run:
   ```
   supabase db reset
   ```
   This will populate your local instance of Supabase with testing data
5. You can access the dashboard for your local setup by pasting this into your browser:
   ```
   http://127.0.0.1:54323
   ```



## Database Setup (Supabase)

Source: [Supabase Docs: Local Development](https://supabase.com/docs/guides/cli/local-development)

We use Supabase for the database and the Supabase JavaScript SDK for frontend authentication and sign-in with Google.

##### Project Setup

1. Sign up for a Supabase account.
2. Create a new project.
3. We will upload migrations to this project from local supabase instances (later steps)

##### Adding to the Local Database

- To make changes to the local database, create a new migration and add necessary sql to update or add to the schema. Do not edit existing migrations.
- Generate a migration:
  ```
  supabase migration new migration_name
  ```
- You can find this migration in `/supabase/migrations`


##### Dummy Data

- You can edit the SQL for creating dummy data in `/supabase/seed.sql`

##### Initialising Tables and Data

- Whenever you run `supabase db reset` it will clear your local database (including auth) and then run your migrations (in the order they were created) and finally run `seed.sql`

##### Adding to the Prod Database

- To upload the local migrations to prod Supabase, first:
1. Login to your Supabase account with:
    ```
    supabase login
    ```
1. Associate your project with your remote project
   ```
   supabase link --project-ref <project-id>
   ```
   You can get <`project-id>` from your project's dashboard URL: https://supabase.com/dashboard/project/ `<project-id>`
2. To deploy migrations to prod, run:
   ```
   supabase db push
   ```
- NOTE: We will add process/logic so that it has to be PRed first
### Google Sign-In Setup

To enable sign-in with Google follow the steps outlined in this [Youtube Video](https://www.youtube.com/watch?v=dE2vtnv83Fc)
In addition to this, in the Authorised JavaScript origins section for your OAuth Client setup you will need to add:
```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:3000
```
To the Authorised Redirect URIs section you will need to add:
```
YOUR_SUPABASE_URL/auth/v1/callback
http://127.0.0.1:54321/auth/v1/callback
http://localhost:54321/auth/v1/callback
```

## Configuration Files

#### `.env` (Front-end)
Create this in `/frontend`
```.env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_KEY=YeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```
These are the default keys for local Supabase

#### `.env` (Back-end)

Create this in root folder
```.env
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=YOUR_PROJECTS_GOOGLE_CLIENT_ID
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=YOUR_PROJECTS_GOOGLE_SECRET
```
These come from the Google Authentication setup (above)

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
    "ENCRYPTION_KEY": "YOUR_ENCRYPTION_KEY",
    "WEBSITE_URL": "YOUR_WEBSITE_URL"
  }
}
```
Our Template for Development
```json
{
  "RouterLambda": {
    "EMAIL_SENDER": "onboarder.recruitment@gmail.com", 
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": 465,
    "SMTP_USERNAME": "onboarder.recruitment@gmail.com",
    "SMTP_PASSWORD": "nanzovzroqbybbns",
    "SUPABASE_URL": "http://host.docker.internal:54321",
    "SUPABASE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    "ENCRYPTION_KEY": "", // Add your encryption key
    "WEBSITE_URL": "http://localhost:5173"
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

#### Website URL 
The `WEBSITE_URL` is used in controller.py
For development, it is the local URL given by VITE when you run `npm run dev`

## Additional Notes

- Ensure all configuration files (.env and env.json) are properly set up before running the project.
- If you encounter issues with the latest NodeJS version, try using v20.6.1.
- For any SMTP provider other than Gmail, update the SMTP settings in `env.json` accordingly.

## Common Issues

#### CORS Error

- This may sometimes occur when trying to make API requests to backend
- To resolve this, ensure you have followed the correct steps above regarding configuration files.
- If this does not work, make sure to have an HTTP Options method alongside every POST request method in the code.

#### Front End Crash (Blank Screen)

- Follow above steps, ensuring both .env files and the env.json file are correct and in the right place

#### SAM cannot find Docker

- Ensure that default Docker Socket is enabled.
- Sometimes you may need to disable this in Docker Advanced Settings, restart and the enable it again.

## Git Management

![Git Strategy Illustrated](https://github.com/user-attachments/assets/bf57a185-7ceb-4f29-8c4e-3f7510242a2c)

### Repository Structure

- Main branch: Stable, deployment-ready code
- Development branches: Isolated for active development

### Commit Guidelines

- Frequent commits to prevent data loss
- Clear, concise commit messages with descriptive keywords
- Important commits tagged and tied to milestones
- Semantic versioning system for version tags

### Branch Management

- Locked main branch to enforce code standards
- Branch naming conventions:
  - Feature branches: 'feature/[description]'
  - Fix branches: 'fix/[description]'
- Maximum two levels of branching from main
- Temporary branches allowed for experimentation (to be cleaned up)

### Merge Requests

- Required for merging into main branch
- Approval needed from at least two team members (one from each other agile team)
- CI/CD pipeline runs automated tests post-approval
- Merge only possible after passing all pipeline checks

### Database Updates (Migrations)
- Process for Approving and Pushing Migrations
- TODO

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

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
