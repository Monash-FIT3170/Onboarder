INSERT INTO public."PROFILE" (user_id, interview_availability) VALUES
    ('9fded038-82cc-4faf-bf78-07132998d1bf', ARRAY['Monday 9 AM - 12 PM']),
    ('a904bb07-79bf-4b38-aaf2-85c9e535baac', ARRAY['Tuesday 1 PM - 4 PM']),
    ('ae2537d0-5d2c-41af-8c0b-d4b39fea12f9', ARRAY['Wednesday 10 AM - 1 PM']),
    ('eb1310e9-e6d3-4c33-9ae0-3f8617b06c3a', ARRAY['Wednesday 10 AM - 1 PM']);

INSERT INTO public."STUDENT_TEAM" (name) VALUES
    ('Team Alpha'),
    ('Team Bravo'),
    ('Team Charlie');

INSERT INTO public."PROFILE_TEAM_INFO" (profile_id, student_team_id, role) VALUES
    (1, 1, 'O'),
    (2, 2, 'A'),
    (3, 3, 'T'),
    (4, 1, 'O');

INSERT INTO public."RECRUITMENT_ROUND" (student_team_id, semester, year, deadline, status) VALUES
    (1, 'Semester 1', 2024, '2024-06-01 12:00:00+00', 'A'),
    (2, 'Semester 2', 2024, '2024-11-01 12:00:00+00', 'I'),
    (3, 'Semester 1', 2025, '2025-06-01 12:00:00+00', 'R');

INSERT INTO public."OPENING" (recruitment_round_id, title, description, status, required_skills, desired_skills, task_email_format, task_enabled) VALUES
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE),
    (1, 'Software Engineer Intern', 'Develop and maintain web applications', 'A', ARRAY['JavaScript', 'Node.js'], ARRAY['React', 'SQL'], 'HTML Format', TRUE),
    (2, 'Data Analyst Intern', 'Analyze data and create reports', 'I', ARRAY['Python', 'SQL'], ARRAY['Tableau'], 'PDF Format', TRUE),
    (3, 'Project Manager Intern', 'Manage project timelines and teams', 'R', ARRAY['Communication', 'Leadership'], ARRAY['Agile'], 'Word Format', TRUE);

INSERT INTO public."TEAM_LEAD_ASSIGNMENT" (opening_id, profile_id) VALUES
    (1, 1),
    (2, 2),
    (3, 3);

INSERT INTO public."APPLICATION" (opening_id, email, name, phone, semesters_until_completion, current_semester, major_enrolled, additional_info, skills, candidate_availability, interview_date, interview_notes, status, profile_id) VALUES
    (1, 'applicant1@example.com', 'John Doe', '123-456-7890', 2, 1, 'Computer Science', 'Interested in backend development', ARRAY['JavaScript', 'Node.js'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-15 10:00:00+00', 'Good technical skills', 'A', 1),
    (2, 'applicant2@example.com', 'Jane Smith', '234-567-8901', 3, 2, 'Data Science', 'Passionate about data analysis', ARRAY['Python', 'SQL'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-16 11:00:00+00', 'Strong analytical skills', 'C', 2),
    (3, 'applicant3@example.com', 'Alice Johnson', '345-678-9012', 1, 3, 'Business Administration', 'Experienced in project management', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-17 09:00:00+00', 'Excellent leadership qualities', 'R', 3),
    (1, 'applicant4@example.com', 'Bob Smith', '456-789-0123', 4, 4, 'Computer Engineering', 'Interested in front-end development', ARRAY['HTML', 'CSS', 'JavaScript'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-18 10:00:00+00', 'Creative problem solver', 'A', 3),
    (2, 'applicant5@example.com', 'Sarah Johnson', '567-890-1234', 2, 5, 'Data Science', 'Strong statistical analysis skills', ARRAY['R', 'SQL'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-19 11:00:00+00', 'Detail-oriented', 'C', 2),
    (3, 'applicant6@example.com', 'Michael Brown', '678-901-2345', 3, 6, 'Business Administration', 'Experience in project coordination', ARRAY['Communication', 'Leadership'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-20 09:00:00+00', 'Excellent team player', 'R', 1),
    (1, 'applicant7@example.com', 'Emily Davis', '789-012-3456', 1, 7, 'Computer Science', 'Passionate about software development', ARRAY['Java', 'Python'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-21 10:00:00+00', 'Quick learner', 'A', 3),
    (2, 'applicant8@example.com', 'David Wilson', '890-123-4567', 2, 8, 'Data Science', 'Experience with data visualization', ARRAY['Python', 'Tableau'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-22 11:00:00+00', 'Strong problem-solving skills', 'C', 2),
    (3, 'applicant9@example.com', 'Olivia Taylor', '901-234-5678', 3, 9, 'Business Administration', 'Leadership experience in student organizations', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-23 09:00:00+00', 'Excellent communication skills', 'R', 1),
    (1, 'applicant10@example.com', 'Daniel Anderson', '012-345-6789', 2, 10, 'Computer Engineering', 'Interested in software testing', ARRAY['Java', 'C++'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-24 10:00:00+00', 'Attention to detail', 'A', 3),
    (2, 'applicant11@example.com', 'Sophia Martinez', '123-456-7890', 3, 11, 'Data Science', 'Experience with machine learning algorithms', ARRAY['Python', 'R'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-25 11:00:00+00', 'Analytical mindset', 'C', 2),
    (3, 'applicant12@example.com', 'Matthew Thompson', '234-567-8901', 1, 12, 'Business Administration', 'Experience in project planning', ARRAY['Communication', 'Leadership'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-26 09:00:00+00', 'Strong organizational skills', 'R', 1),
    (1, 'applicant13@example.com', 'Ava Hernandez', '345-678-9012', 2, 13, 'Computer Science', 'Passionate about web development', ARRAY['HTML', 'CSS', 'JavaScript'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-27 10:00:00+00', 'Creative problem solver', 'A', 3),
    (2, 'applicant14@example.com', 'James Lopez', '456-789-0123', 3, 14, 'Data Science', 'Strong analytical skills', ARRAY['Python', 'SQL'], ARRAY['Weekends 10 AM - 4 PM'], '2024-06-28 11:00:00+00', 'Detail-oriented', 'C', 2),
    (3, 'applicant15@example.com', 'Mia Adams', '567-890-1234', 1, 15, 'Business Administration', 'Experience in project management', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-06-29 09:00:00+00', 'Excellent team player', 'R', 1),
    (1, 'applicant16@example.com', 'Benjamin Lee', '678-901-2345', 2, 16, 'Computer Engineering', 'Interested in software development', ARRAY['Java', 'Python'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-06-30 10:00:00+00', 'Quick learner', 'A', 3),
    (2, 'applicant17@example.com', 'Charlotte Hill', '789-012-3456', 3, 17, 'Data Science', 'Experience with data analysis', ARRAY['Python', 'Tableau'], ARRAY['Weekends 10 AM - 4 PM'], '2024-07-01 11:00:00+00', 'Strong problem-solving skills', 'C', 2),
    (3, 'applicant18@example.com', 'Henry Scott', '890-123-4567', 1, 18, 'Business Administration', 'Leadership experience in student organizations', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-07-02 09:00:00+00', 'Excellent communication skills', 'R', 1),
    (1, 'applicant19@example.com', 'Amelia Green', '901-234-5678', 2, 19, 'Computer Engineering', 'Interested in software testing', ARRAY['Java', 'C++'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-07-03 10:00:00+00', 'Attention to detail', 'A', 3),
    (2, 'applicant20@example.com', 'Daniel Ramirez', '012-345-6789', 3, 20, 'Data Science', 'Experience with machine learning algorithms', ARRAY['Python', 'R'], ARRAY['Weekends 10 AM - 4 PM'], '2024-07-04 11:00:00+00', 'Analytical mindset', 'C', 2),
    (3, 'applicant21@example.com', 'Sophie Reed', '123-456-7890', 1, 21, 'Business Administration', 'Experience in project planning', ARRAY['Communication', 'Leadership'], ARRAY['Monday 1 PM - 5 PM'], '2024-07-05 09:00:00+00', 'Strong organizational skills', 'R', 1),
    (1, 'applicant22@example.com', 'Oliver Turner', '234-567-8901', 2, 22, 'Computer Science', 'Passionate about web development', ARRAY['HTML', 'CSS', 'JavaScript'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-07-06 10:00:00+00', 'Creative problem solver', 'A', 3),
    (2, 'applicant23@example.com', 'Lily Phillips', '345-678-9012', 3, 23, 'Data Science', 'Strong analytical skills', ARRAY['Python', 'SQL'], ARRAY['Weekends 10 AM - 4 PM'], '2024-07-07 11:00:00+00', 'Detail-oriented', 'C', 2),
    (3, 'applicant24@example.com', 'Lucas Campbell', '456-789-0123', 1, 24, 'Business Administration', 'Experience in project management', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-07-08 09:00:00+00', 'Excellent team player', 'R', 1),
    (1, 'applicant25@example.com', 'Emily Parker', '567-890-1234', 2, 25, 'Computer Engineering', 'Interested in software development', ARRAY['Java', 'Python'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-07-09 10:00:00+00', 'Quick learner', 'A', 3),
    (2, 'applicant26@example.com', 'Jack Evans', '678-901-2345', 3, 26, 'Data Science', 'Experience with data analysis', ARRAY['Python', 'Tableau'], ARRAY['Weekends 10 AM - 4 PM'], '2024-07-10 11:00:00+00', 'Strong problem-solving skills', 'C', 2),
    (3, 'applicant27@example.com', 'Aria Edwards', '789-012-3456', 1, 27, 'Business Administration', 'Leadership experience in student organizations', ARRAY['Leadership', 'Agile'], ARRAY['Monday 1 PM - 5 PM'], '2024-07-11 09:00:00+00', 'Excellent communication skills', 'R', 1),
    (1, 'applicant28@example.com', 'Noah Collins', '890-123-4567', 2, 28, 'Computer Engineering', 'Interested in software testing', ARRAY['Java', 'C++'], ARRAY['Weekdays 9 AM - 5 PM'], '2024-07-12 10:00:00+00', 'Attention to detail', 'A', 3),
    (2, 'applicant29@example.com', 'Mila Stewart', '901-234-5678', 3, 29, 'Data Science', 'Experience with machine learning algorithms', ARRAY['Python', 'R'], ARRAY['Weekends 10 AM - 4 PM'], '2024-07-13 11:00:00+00', 'Analytical mindset', 'C', 2),
    (3, 'applicant30@example.com', 'Ethan Rivera', '012-345-6789', 1, 30, 'Business Administration', 'Experience in project planning', ARRAY['Communication', 'Leadership'], ARRAY['Monday 1 PM - 5 PM'], '2024-07-14 09:00:00+00', 'Strong organizational skills', 'R', 1);
