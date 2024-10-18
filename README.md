# Onboarder

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-22-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

Recruitment platform for Monash University student teams

## Table of Contents

- [Onboarder](#onboarder)
  - [Table of Contents](#table-of-contents)
  - [Team Members](#team-members)
  - [Prerequisites](#prerequisites)
  - [Configuration Files](#configuration-files)
    - [`.env` (Front-end)](#env-front-end)
    - [`.env` (Root)](#env-root)
    - [`env.json` (Root)](#envjson-root)
      - [Sinked FIT3170 Template](#sinked-fit3170-template)
      - [Here is a more general version of the template](#here-is-a-more-general-version-of-the-template)
      - [env.json Email Configuration](#envjson-email-configuration)
      - [env.json Supabase Configuration](#envjson-supabase-configuration)
      - [env.json Encryption Key](#envjson-encryption-key)
      - [env.json Website URL](#envjson-website-url)
      - [Google Calendar variables](#google-calendar-variables)
      - [Scheduler Queue URL](#scheduler-queue-url)
  - [Setup Instructions](#setup-instructions)
    - [Front-end Setup](#front-end-setup)
    - [Back-end Setup](#back-end-setup)
      - [Sam](#sam)
      - [Supabase Local Development](#supabase-local-development)
      - [Optional: Setting up local testing](#optional-setting-up-local-testing)
      - [Opening Website in Browser](#opening-website-in-browser)
  - [Editing the Database](#editing-the-database)
    - [Project Setup](#project-setup)
      - [Adding to the Local Database](#adding-to-the-local-database)
      - [Dummy Data](#dummy-data)
      - [Initialising Tables and Data](#initialising-tables-and-data)
      - [Adding to the Prod Database](#adding-to-the-prod-database)
    - [Google Sign-In Setup](#google-sign-in-setup)
  - [Additional Notes](#additional-notes)
  - [Prod Deployment Instructions](#prod-deployment-instructions)
  - [Common Issues](#common-issues)
    - [CORS Error](#cors-error)
    - [Front End Crash (Blank Screen)](#front-end-crash-blank-screen)
    - [SAM cannot find Docker](#sam-cannot-find-docker)
    - [NPM Dependency error (node modules not found)](#npm-dependency-error-node-modules-not-found)
  - [Git Management](#git-management)
    - [Repository Structure](#repository-structure)
    - [Commit Guidelines](#commit-guidelines)
    - [Branch Management](#branch-management)
    - [Merge Requests](#merge-requests)
    - [Database Updates (Migrations)](#database-updates-migrations)
  - [Contributors](#contributors)

## Team Members

Refer to all-contributors at the bottom of this document.

## Prerequisites

To run this project, you'll need the following software and hardware:

- Docker
- AWS CLI
- AWS SAM CLI
- Python 3.12
- NodeJS (v20.6.1 recommended if the latest version doesn't work)
- .env files and env.json file (details below)
- Supabase account (If you plan on working with Prod)

We use Supabase for the database and the Supabase JavaScript SDK for frontend authentication and sign-in with Google.
For development, team members work on local Supabase instances.

## Configuration Files

You need to create these three files in your project to be able to develop.
Do not add these files to Git.

### `.env` (Front-end)

Create `.env` file in `/frontend`

```.env
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_KEY=YeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

These are the default keys for local Supabase

### `.env` (Root)

Create `.env` file in root folder

```.env
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=<your projects client id>
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=<your projects secret>
DEV_EMAIL=<your monash email>
```

Replace `<your monash email>` with your student email.

If this has been done, ask your team for these keys, otherwise complete "Google Sign-In Setup" later in this document.

### `env.json` (Root)

The `env.json` file in the root folder contains crucial configuration settings for the back-end, including email settings, database connections, and encryption keys. Here's a breakdown of its structure and how to set it up:

#### Sinked FIT3170 Template

```json
{
  "RouterLambda": {
    "EMAIL_SENDER": "onboarder.recruitment@gmail.com",
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": 465,
    "SMTP_USERNAME": "onboarder.recruitment@gmail.com",
    "SMTP_PASSWORD": "YOUR_SMTP_PASSWORD",
    "SUPABASE_URL": "http://host.docker.internal:54321",
    "SUPABASE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0",
    "ENCRYPTION_KEY": "YOUR_ENCRYPTION_KEY", // Add your encryption key
    "WEBSITE_URL": "http://127.0.0.1:5173",
    "GOOGLE_CALENDAR_TOKEN": "",
    "GOOGLE_CALENDAR_REFRESH_TOKEN": "",
    "GOOGLE_CALENDAR_TOKEN_URI": "",
    "GOOGLE_CALENDAR_CLIENT_ID": "",
    "GOOGLE_CALENDAR_CLIENT_SECRET": "",
    "GOOGLE_CALENDAR_EXPIRY": "",
    "INTERVIEW_SCHEDULER_QUEUE_URL": ""
  }
}
```

#### Here is a more general version of the template

```json
{
  // For future developers
  "RouterLambda": {
    "EMAIL_SENDER": "YOUR_EMAIL@GMAIL.COM",
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": 465,
    "SMTP_USERNAME": "YOUR_EMAIL@GMAIL.COM",
    "SMTP_PASSWORD": "YOUR_SMTP_PASSWORD",
    "SUPABASE_URL": "YOUR_SUPABASE_URL",
    "SUPABASE_KEY": "YOUR_SUPABASE_KEY",
    "ENCRYPTION_KEY": "YOUR_ENCRYPTION_KEY",
    "WEBSITE_URL": "YOUR_WEBSITE_URL",
    "GOOGLE_CALENDAR_TOKEN": "",
    "GOOGLE_CALENDAR_REFRESH_TOKEN": "",
    "GOOGLE_CALENDAR_TOKEN_URI": "",
    "GOOGLE_CALENDAR_CLIENT_ID": "",
    "GOOGLE_CALENDAR_CLIENT_SECRET": "",
    "GOOGLE_CALENDAR_EXPIRY": "",
    "INTERVIEW_SCHEDULER_QUEUE_URL": ""
  }
}
```

#### env.json Email Configuration

- `EMAIL_SENDER`: The email address used to send notifications.
- `SMTP_HOST`, `SMTP_PORT`: SMTP server settings (example shows Gmail's settings).
- `SMTP_USERNAME`: Usually the same as `EMAIL_SENDER`.
- `SMTP_PASSWORD`: For Gmail, use an App Password. [This video guide](https://www.youtube.com/watch?v=g_j6ILT-X0k&t=125s) explains how to generate one.

Note: While we use Gmail as an example, you can configure any SMTP provider by updating these values accordingly.

#### env.json Supabase Configuration

- `SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_KEY`: Your Supabase project API key.

These can be found in your Supabase project settings.

#### env.json Encryption Key

The `ENCRYPTION_KEY` is used to encrypt sensitive data, such as application IDs in emails. Generate it once using the Fernet library in Python:

```python
from cryptography.fernet import Fernet

# Generate a key (do this only once and store it securely)
key = Fernet.generate_key()
print(key.decode())  # This prints the key as a string
```

Run this script once, save the output, and use it as your `ENCRYPTION_KEY` in the `env.json` file.

Important: Keep your `env.json` file and especially the `ENCRYPTION_KEY` secure. Never commit them to version control or share them publicly.

#### env.json Website URL

The `WEBSITE_URL` is used in controller.py
For development, it is the local URL given by VITE when you run `npm run dev`

#### Google Calendar variables

TODO

#### Scheduler Queue URL

This is used for deployment. Having it blank means that the codebase will use a different implenentation with python for testing.

## Setup Instructions

### Front-end Setup

1. Install NodeJS (v20.6.1 if the latest version doesn't work).
2. Ensure the second `.env` file is in frontend folder
3. Open a terminal in the front-end folder:

   ```bash
   cd frontend
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. If any packages have security issues, run:

   ```bash
   npm audit fix
   ```

   (Note: Use discretion as this might introduce breaking changes)

6. Start the development server:

   ```bash
   npm run dev
   ```

### Back-end Setup

#### Sam

1. Install Docker, AWS CLI, AWS SAM CLI, and Python 3.12.
2. Add the `env.json` file to the root folder (see configuration details below).
3. Keep Docker running in the background.
4. Open a terminal in the root folder and execute:

   ```bash
   sam build
   ```

5. After completion, run:

   ```bash
   sam local start-api --warm-containers EAGER --env-vars env.json
   ```

#### Supabase Local Development

1. Add the `.env` file to the root folder (see configuration details below).
2. Install [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started?queryGroups=platform&platform=windows)
3. Keep Docker running in the background.
4. Ensure Docker is configured for your OS according to the screenshot in this page: [Supabase Docs: Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
5. Open a terminal in the root folder and execute:

   `python pre-process-seed.py`

   then

   `supabase start` or `npx supabase start`

   NOTE: If you need to add npx for this to work, you will need to use `npx` before all `supabase` commands you do
   This may take a while the first time.

6. After completion, run:

   ```bash
   supabase db reset
   ```

   This will populate your local instance of Supabase with testing data

7. You can access the supabase dashboard for your local setup by pasting this into your browser:

   <http://127.0.0.1:54323>

#### Optional: Setting up local testing

If you would like to try run the algorithm, you will need a python virtual environment.

1. Navigate to backend/lambda
2. Create a virtual environment by running:

   ```bash
   python -m venv venv
   ```

3. Then activate it:

   ```bash
   source venv/bin/activate
   # On Windows, use `venv\Scripts\activate`
   # If these don't work, refer to (https://docs.python.org/3/library/venv.html)
   ```

4. Then install the requirements:

   ```bash
   pip install -r requirements.txt
   ```

#### Opening Website in Browser

1. Navigate to `http://127.0.0.1:5173/` in your browser. (**NOT localhost:5173**)
2. Sign in with your Monash account.
3. You are now good to start developing.

## Editing the Database

Source: [Supabase Docs: Local Development](https://supabase.com/docs/guides/cli/local-development)

### Project Setup

0. Only do steps 1 and 2 if your team does not have a Supabase project yet.
1. Sign up for a Supabase account.
2. Create a new project.
3. We will upload migrations to this project from local supabase instances (later steps)

#### Adding to the Local Database

- To make changes to the local database, create a new migration and add necessary sql to update or add to the schema. Do not edit existing migrations.
- Generate a migration:

  ```bash
  supabase migration new migration_name
  ```

- You can find this migration in `/supabase/migrations`

#### Dummy Data

- You can edit the SQL for creating dummy data in `/supabase/seed.sql`
- If this is empty, it will be filled after running `python pre-process-seed.py`

#### Initialising Tables and Data

- Whenever you run `supabase db reset` it will clear your local database (including auth) and then run your migrations (in the order they were created) and finally run `seed.sql`

#### Adding to the Prod Database

- To upload the local migrations to prod Supabase, first:

1. Login to your Supabase account with:

   ```bash
   supabase login
   ```

2. Associate your project with your remote project

   ```bash
   supabase link --project-ref <project-id>
   ```

   You can get <`project-id>` from your project's dashboard URL: <https://supabase.com/dashboard/project/> `<project-id>`

3. To deploy migrations to prod, run:

   ```bash
   supabase db push
   ```

   If you want to add seed.sql data to db, run:

   ```bash
   supabase db push linked
   ```

  NOTE: This will overwrite your prod data.

### Google Sign-In Setup

To enable sign-in with Google follow the steps outlined in this [Youtube Video](https://www.youtube.com/watch?v=dE2vtnv83Fc)
In addition to this, in the Authorised JavaScript origins section for your OAuth Client setup you will need to add:

```text
http://localhost:5173
http://127.0.0.1:5173
http://localhost:3000
http://127.0.0.1:3000
```

To the Authorised Redirect URIs section you will need to add:

```text
YOUR_SUPABASE_URL/auth/v1/callback
http://127.0.0.1:54321/auth/v1/callback
http://localhost:54321/auth/v1/callback
```

## Additional Notes

- Ensure all configuration files (.env and env.json) are properly set up before running the project.
- If you encounter issues with the latest NodeJS version, try using v20.6.1.
- For any SMTP provider other than Gmail, update the SMTP settings in `env.json` accordingly.

## Prod Deployment Instructions

TODO

## Common Issues

### CORS Error

- This may sometimes occur when trying to make API requests to backend
- To resolve this, ensure you have followed the correct steps above regarding configuration files.
- If this does not work, make sure to have an HTTP Options method alongside every POST request method in the code.

### Front End Crash (Blank Screen)

- Follow above steps, ensuring both .env files and the env.json file are correct and in the right place

### SAM cannot find Docker

- Ensure that default Docker Socket is enabled.
- Sometimes you may need to disable this in Docker Advanced Settings, restart and the enable it again.

### NPM Dependency error (node modules not found)

- You might get this error:
  `The file does not exist at "Your_Directory/Onboarder/frontend/node_modules/.vite/deps/some_dependency" which is in the optimize deps directory. The dependency might be incompatible with the dep optimizer. Try adding it to 'optimizeDeps.exclude'.`

Fix:
Delete node_module/.vite and then rerun `npm install` and `npm run dev`

## Git Management

![Git Strategy Illustrated](https://github.com/user-attachments/assets/bf57a185-7ceb-4f29-8c4e-3f7510242a2c)

### Repository Structure

- Main branch: Stable, deployment-ready code
- Development branches: Isolated for active development

### Commit Guidelines

- Refer to: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.4/)
- Frequent commits to prevent data loss
- Clear, concise commit messages with descriptive keywords
- Important commits tagged and tied to milestones
- Semantic versioning system for version tags

### Branch Management

- Locked main branch to enforce code standards
- Branch naming conventions:
  - Feature branches: 'feature/[description]'
  - Fix branches: 'fix/[description]'
  - Test branches: 'test/[description]'
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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AbBaSaMo"><img src="https://avatars.githubusercontent.com/u/95030427?v=4?s=100" width="100px;" alt="AbBaSaMo"/><br /><sub><b>AbBaSaMo</b></sub></a><br /><a href="#projectManagement-AbBaSaMo" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://danielhong.dev/"><img src="https://avatars.githubusercontent.com/u/108613049?v=4?s=100" width="100px;" alt="Daniel"/><br /><sub><b>Daniel</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=windneverstops" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=windneverstops" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/FahadAssadi"><img src="https://avatars.githubusercontent.com/u/91127049?v=4?s=100" width="100px;" alt="Fahad Assadi"/><br /><sub><b>Fahad Assadi</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=FahadAssadi" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=FahadAssadi" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jcru0005"><img src="https://avatars.githubusercontent.com/u/62014277?v=4?s=100" width="100px;" alt="Jesse Cruickshank"/><br /><sub><b>Jesse Cruickshank</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=jcru0005" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=jcru0005" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/JesseCr00"><img src="https://avatars.githubusercontent.com/u/167516726?v=4?s=100" width="100px;" alt="Jesse Cruickshank"/><br /><sub><b>Jesse Cruickshank</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=JesseCr00" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=JesseCr00" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Khang0018"><img src="https://avatars.githubusercontent.com/u/162103344?v=4?s=100" width="100px;" alt="Khang0018"/><br /><sub><b>Khang0018</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Khang0018" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Khang0018" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/NgocDuy1234"><img src="https://avatars.githubusercontent.com/u/155885179?v=4?s=100" width="100px;" alt="NgocDuy1234"/><br /><sub><b>NgocDuy1234</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=NgocDuy1234" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=NgocDuy1234" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Rahul-Saxena-1"><img src="https://avatars.githubusercontent.com/u/163801505?v=4?s=100" width="100px;" alt="Rahul-Saxena-1"/><br /><sub><b>Rahul-Saxena-1</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Rahul-Saxena-1" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Rahul-Saxena-1" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Rahuls525"><img src="https://avatars.githubusercontent.com/u/140256502?v=4?s=100" width="100px;" alt="Rahuls525"/><br /><sub><b>Rahuls525</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Rahuls525" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Rahuls525" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sairamishetty"><img src="https://avatars.githubusercontent.com/u/126044967?v=4?s=100" width="100px;" alt="Sai Ashish Ramishetty"/><br /><sub><b>Sai Ashish Ramishetty</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=sairamishetty" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=sairamishetty" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Saxena-Rahul"><img src="https://avatars.githubusercontent.com/u/91989487?v=4?s=100" width="100px;" alt="Saxena-Rahul"/><br /><sub><b>Saxena-Rahul</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Saxena-Rahul" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Saxena-Rahul" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ShubhBajpai25"><img src="https://avatars.githubusercontent.com/u/161799525?v=4?s=100" width="100px;" alt="Shubh Bajpai"/><br /><sub><b>Shubh Bajpai</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=ShubhBajpai25" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=ShubhBajpai25" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Tavishi11"><img src="https://avatars.githubusercontent.com/u/71335738?v=4?s=100" width="100px;" alt="Tavishi11"/><br /><sub><b>Tavishi11</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Tavishi11" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=Tavishi11" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/TavishiSaxena"><img src="https://avatars.githubusercontent.com/u/139798920?v=4?s=100" width="100px;" alt="TavishiSaxena"/><br /><sub><b>TavishiSaxena</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=TavishiSaxena" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=TavishiSaxena" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/umairBinMohammad"><img src="https://avatars.githubusercontent.com/u/127007460?v=4?s=100" width="100px;" alt="Umair Bin Mohammad"/><br /><sub><b>Umair Bin Mohammad</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=umairBinMohammad" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=umairBinMohammad" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ahmadhafiz17"><img src="https://avatars.githubusercontent.com/u/140464163?v=4?s=100" width="100px;" alt="ahmadhafiz17"/><br /><sub><b>ahmadhafiz17</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=ahmadhafiz17" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=ahmadhafiz17" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/apps/allcontributors"><img src="https://avatars.githubusercontent.com/in/23186?v=4?s=100" width="100px;" alt="allcontributors[bot]"/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=allcontributors[bot]" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=allcontributors[bot]" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/arazzell"><img src="https://avatars.githubusercontent.com/u/58514489?v=4?s=100" width="100px;" alt="arazzell"/><br /><sub><b>arazzell</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=arazzell" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=arazzell" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/brendonPerera"><img src="https://avatars.githubusercontent.com/u/168376672?v=4?s=100" width="100px;" alt="brendonPerera"/><br /><sub><b>brendonPerera</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=brendonPerera" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=brendonPerera" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/HanifZafari"><img src="https://avatars.githubusercontent.com/u/28986046?v=4?s=100" width="100px;" alt="hanifzafari"/><br /><sub><b>hanifzafari</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=HanifZafari" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=HanifZafari" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ranithsim"><img src="https://avatars.githubusercontent.com/u/126638614?v=4?s=100" width="100px;" alt="ranithsim"/><br /><sub><b>ranithsim</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=ranithsim" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=ranithsim" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sai-ramishetty"><img src="https://avatars.githubusercontent.com/u/163802375?v=4?s=100" width="100px;" alt="sai-ramishetty"/><br /><sub><b>sai-ramishetty</b></sub></a><br /><a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=sai-ramishetty" title="Code">💻</a> <a href="https://github.com/Monash-FIT3170/Onboarder/commits?author=sai-ramishetty" title="Documentation">📖</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
