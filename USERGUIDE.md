# Onboarder: Student Team Recruitment Platform

Welcome to **Onboarder**, a recruitment platform designed exclusively for Monash University student teams. This application facilitates the recruitment process, enabling team owners, admins, team leads, and applicants to efficiently manage and participate in team recruitment.

## Table of Contents
1. [Overview](#overview)
2. [Roles and Permissions](#roles-and-permissions)
   - [Owner](#owner)
   - [Admin](#admin)
   - [Team Lead](#team-lead)
   - [Applicant](#applicant)
3. [Monash Authentication](#monash-authentication)
4. [Features](#features)
5. [Getting Started](#getting-started)
6. [Contact](#contact)

---

## Overview

Onboarder is tailored to streamline the recruitment process for Monash University student teams. The platform ensures secure sign on via Monash login and provides different levels of functionality based on user roles such as **Owner**, **Admin**, **Team Lead**, and **Applicant**.

## Student Application Stages
When a student goes through the application, they have 3 stages.

1. Applicant
- An applicant is a student who has submitted an application.
2. Candidate
- A candidate is a student whose application has been accepted. This means that they will be interviewed.
3. Recruit
- A recruit is a student who has completed the interview, and was accepted. The team will sort out further onboarding outside of the application.
4. Rejected
- If an applicant or candidate is rejected, they are out of the recruitment process.

## Roles and Permissions

Each role in the Onboarder platform has specific access and permissions to interact with the platform.
For each team you are a part of, you will have one of the three roles.

### Team Lead
- **Primary responsibility**: Manages recruitment for specific team openings. They review applications, and conduct interviews.
- **Key actions**:
  - Is invited to team by owner.
  - Is assigned to opening(s) by Owner or Admins.
  - Can review and accept/deny applicants based on their Application
  - Can submit interview feedback for a candidate.
  - Can review and accept/deny candidates who have been interviewed.
  - Can put in availability to conduct interviews
  - Can send emails for candidate to submit their interview availability
  - Can run interview scheduling algorithm
  - Can manually schedule interviews missed by algorithm, or edit the date of interviews scheduled by the algorithm

### Admin
- **Primary responsibility**: Supports the owner in managing the team.
- **Key actions**:
  - Is invited to team by owner 
  - Has all permissions of team lead, as well as:
  - Can edit the email configuration for candidates to submit their interview availability
  - Can create recruitment rounds
  - Can open/close/archive recruitment rounds
  - Can create openings for a recruitment round.
  - Can assign team leads (can assign any user to be a team lead for an opening in the team. )
 
### Owner
- **Primary responsibility**: Manages Team
- **Key actions**:
  - Is the person who created the team.
  - Has all permissions of admin/team lead, as well as:
  - Can edit/delete team
  - Can invite members to the team as admins or team leads

### Applicant
- **Primary responsibility**: Apply for team openings.
- **Key actions**:
  - Non logged-in user. 
  - Browse openings for student teams.
  - Submit applications for desired openings.
  - Can submit interview availability via email link if their application is accepted.
  - Gets sent a google calendar invite if an interview is successfully allocated (and team lead sends the email). 

## Monash Authentication

Onboarder uses **Monash University's secure login system** to ensure that only verified Monash students can access the platform. You must use your **Monash student email and password** to log in. This system guarantees that only Monash-affiliated users can participate.

### How to Log In:
1. Open the Onboarder platform.
2. Click the **Login with Monash SSO** button.
3. Enter your Monash student credentials when prompted.
4. You will be redirected to the Onboarder dashboard based on your role.
## Features

- **Monash Authentication**: Secure login via Monash University's authentication system ensures only verified Monash students can access the platform.

- **Role-based Permissions**: The platform offers distinct functionalities based on user roles, ensuring appropriate access and controls for **Owners**, **Admins**, **Team Leads**, and **Applicants**.
  - **Owners** can create and manage teams, assign roles, and oversee the entire recruitment process.
  - **Admins** support Owners in managing team settings and applicant submissions.
  - **Team Leads** manage recruitment for specific team openings, including interviewing and reviewing applicants.
  - **Applicants** can browse team openings, apply for positions, and track their application status.

- **Team Creation & Management**: Owners and Admins can create and manage student teams, set up recruitment cycles, and assign roles to team leads and admins.

- **Openings & Applications**: Team Leads can create and manage openings within their team. Applicants can explore these openings and submit applications directly through the platform.

- **Application Review Process**: Admins and Team Leads can review applications, interview candidates, and update the status of applicants throughout the recruitment process.

- **Application Tracking**: Applicants can monitor the progress of their applications, from submission to interviews and final decisions.

- **Secure, Role-based Dashboard**: Each user role is provided with a personalized dashboard, displaying relevant team openings, applications, and tasks.

## Getting Started

### Landing Page

![Landing Page Screenshot](frontend/src/assets/landing_page.png)

### As a student/applicant

Once on the website, click on `Apply for a position`

You will be able to see what openings are available for various student teams, and apply for them.

### As a member of a student team

To get started with Onboarder, access the website and follow these steps:

Log in with Monash SSO:

 - Click the Login with Monash SSO button.
Enter your Monash student email and password to access the platform. (If you have not used it before, it will automatically create an account for you)
Upon successful authentication, you will be redirected to the dashboard. You can create a student team, where you will be the owner, and any teams that an owner has invited you to will show up here.

Set Up Your Profile:

 - If you are an Owner or Admin, you can start by setting up your team profile and managing team settings.
As a Team Lead, create your team's specific recruitment openings.
As an Applicant, browse the available teams and apply for open positions.
Start Managing or Applying:

 - Owners/Admins: Manage your team settings, assign team leads, and monitor the recruitment process.
Team Leads: Post new openings, review applicants, and schedule interviews.

 - Applicants: Apply to openings, track application statuses, and engage with team leads for potential interviews.

 - Review Recruitment Cycles: Regularly check your dashboard for updates, whether it’s new applications (for team leads and admins) or application status changes (for applicants).

## Contact

Please contact the owners of the repo for any questions.
