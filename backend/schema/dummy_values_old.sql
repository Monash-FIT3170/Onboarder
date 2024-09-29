INSERT INTO public."PROFILE" (user_id, email, interview_availability) VALUES
    ('b96f9a36-61a2-4539-9eaf-0d55570997cf', 'lettersayan@gmail.com', ARRAY['Monday 9 AM - 12 PM']),
    ('0c2fa488-85cf-43b0-a6ae-0662151442f4', 'fass0001@student.monash.edu', ARRAY['Tuesday 1 PM - 4 PM']),
    ('a0442d6b-770c-4284-b7d9-cb061be219e9', 'assadifahad@gmail.com', ARRAY['Wednesday 10 AM - 1 PM']);

INSERT INTO public."PROFILE" (email) VALUES
    ('jcru0005@student.monash.edu');

INSERT INTO public."STUDENT_TEAM" (name, description) VALUES
    ('Team Alpha', 'Software Development Team'),
    ('Team Bravo', 'Data Analysis Team'),
    ('Team Charlie', 'Project Management Team');

INSERT INTO public."PROFILE_TEAM_INFO" (profile_id, student_team_id, role) VALUES
    (1, 1, 'O'),
    (1, 2, 'O'),
    (1, 3, 'O'),
    (2, 1, 'A'),
    (2, 2, 'T'),
    (2, 3, 'T'),
    (3, 1, 'A'),
    (3, 2, 'T'),
    (3, 3, 'T'),
    (4, 1, 'A'), -- Jesse
    (4, 2, 'T'), -- Jesse
    (4, 3, 'T'); -- Jesse
    

INSERT INTO public."RECRUITMENT_ROUND" (student_team_id, semester, year, deadline, status) VALUES
    (1, 'Semester 2', 2024, '2024-10-01 12:00:00+00', 'A'),
    (2, 'Semester 2', 2024, '2024-11-01 12:00:00+00', 'A'),
    (3, 'Semester 2', 2024, '2024-12-01 12:00:00+00', 'A'),
    (1, 'Semester 1', 2025, '2025-03-01 12:00:00+00', 'I'),
    (2, 'Semester 1', 2025, '2025-06-01 12:00:00+00', 'I'),
    (3, 'Semester 1', 2025, '2025-11-01 12:00:00+00', 'I');
    

INSERT INTO public."OPENING" (recruitment_round_id, title, description, status, required_skills, desired_skills, task_email_format, task_enabled) VALUES
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (1, 'Daata Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (1, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (2, 'Software Engineeer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Dataa Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (2, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (3, 'Software Engineer Inteern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (3, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Inteern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (4, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (4, 'Daata Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (4, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (5, 'Software Engineeer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (5, 'Dataa Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (5, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (6, 'Software Engineer Inteern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (6, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (6, 'Project Manager Inteern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE);
    --(1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    --(2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    --(3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE);
    --(1, 'Sooftware Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    --(2, 'Data Analyst Inteern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    --(3, 'Project Manager Internn', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    --(1, 'Software Engineer Inteern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    --(2, 'Data Analyst Interrn', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    --(3, 'Project Maanaager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    --(1, 'Sofftware Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    --(2, 'Data Analyst Internn', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    --(3, 'Project Maanager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE);

INSERT INTO public."TEAM_LEAD_ASSIGNMENT" (opening_id, profile_id) VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 1),
    (5, 2),
    (6, 3),
    (7, 1),
    (8, 2),
    (9, 3);


INSERT INTO public."APPLICATION" (opening_id, email, name, phone, semesters_until_completion, current_semester, major_enrolled, additional_info, skills, candidate_availability, interview_date, interview_notes, interview_score, status, profile_id, course_name) VALUES
    (1, 'applicant1@example.com', 'John Doe', '123-456-7890', 2, 1, 'Computer Science', 'Interested in backend development', ARRAY['JavaScript', 'Node.js'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-15 10:00:00+00', 'Good technical skills', 3,'A', 1, 'Computer Science'),
    (2, 'applicant2@example.com', 'Jane Smith', '234-567-8901', 3, 2, 'Data Science', 'Passionate about data analysis', ARRAY['Python', 'SQL'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-16 11:00:00+00', 'Strong analytical skills', 5,'C', 2, 'Computer Science'),
    (3, 'applicant3@example.com', 'Alice Johnson', '345-678-9012', 1, 3, 'Business Administration', 'Experienced in project management', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-17 09:00:00+00', 'Excellent leadership qualities', 5, 'R', 3, 'Computer Science'),
    (1, 'applicant4@example.com', 'Bob Smith', '456-789-0123', 4, 4, 'Computer Engineering', 'Interested in front-end development', ARRAY['HTML', 'CSS', 'JavaScript'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-18 10:00:00+00', 'Creative problem solver', 5, 'A', 3, 'Computer Science'),
    (2, 'applicant5@example.com', 'Sarah Johnson', '567-890-1234', 2, 5, 'Data Science', 'Strong statistical analysis skills', ARRAY['R', 'SQL'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-19 11:00:00+00', 'Detail-oriented', 5, 'C', 2, 'Computer Science'),
    (3, 'applicant6@example.com', 'Michael Brown', '678-901-2345', 3, 6, 'Business Administration', 'Experience in project coordination', ARRAY['Communication', 'Leadership'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-20 09:00:00+00', 'Excellent team player', 5, 'R', 1, 'Computer Science'),
    (1, 'applicant7@example.com', 'Emily Davis', '789-012-3456', 1, 7, 'Computer Science', 'Passionate about software development', ARRAY['Java', 'Python'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-21 10:00:00+00', 'Quick learner', 5, 'A', 3, 'Computer Science'),
    (2, 'applicant8@example.com', 'David Wilson', '890-123-4567', 2, 8, 'Data Science', 'Experience with data visualization', ARRAY['Python', 'Tableau'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-22 11:00:00+00', 'Strong problem-solving skills', 5, 'C', 2, 'Computer Science'),
    (3, 'applicant9@example.com', 'Olivia Taylor', '901-234-5678', 3, 9, 'Business Administration', 'Leadership experience in student organizations', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-23 09:00:00+00', 'Excellent communication skills', 5, 'R', 1, 'Computer Science'),
    (1, 'applicant10@example.com', 'Daniel Anderson', '012-345-6789', 2, 10, 'Computer Engineering', 'Interested in software testing', ARRAY['Java', 'C++'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-24 10:00:00+00', 'Attention to detail', 5, 'A', 3, 'Computer Science'),
    (2, 'applicant11@example.com', 'Sophia Martinez', '123-456-7890', 3, 11, 'Data Science', 'Experience with machine learning algorithms', ARRAY['Python', 'R'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-25 11:00:00+00', 'Analytical mindset', 5, 'C', 2, 'Computer Science'),
    (3, 'applicant12@example.com', 'Matthew Thompson', '234-567-8901', 1, 12, 'Business Administration', 'Experience in project planning', ARRAY['Communication', 'Leadership'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-26 09:00:00+00', 'Strong organizational skills', 5, 'R', 1, 'Computer Science');