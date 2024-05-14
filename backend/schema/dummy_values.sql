INSERT INTO public."STUDENT_TEAM" (name)
VALUES
    ('Team A'),
    ('Team B'),
    ('Team C'),
    ('Team D'),
    ('Team E');

INSERT INTO public."RECRUITMENT_ROUND" (semester, year, student_team_id, status)
VALUES
    ('1', 2024, 1, 'active'),
    ('2', 2024, 2, 'active'),
    ('1', 2024, 3, 'archived'),
    ('2', 2024, 4, 'active'),
    ('2', 2024, 5, 'inactive');

INSERT INTO public."OPENING" ("recruitment_round_ID", title, description, app_role, status, required_skills, desired_skills)
VALUES
    (1, 'Software Engineer', 'Develop and maintain web applications', 'developer', 'open', '{"JavaScript", "React"}', '{"Python", "Django"}'),
    (1, 'UI/UX Designer', 'Design user interfaces and experiences', 'designer', 'open', '{"Adobe XD", "Figma"}', '{"Sketch", "Prototyping"}'),
    (2, 'Data Analyst', 'Analyze and visualize data', 'analyst', 'closed', '{"SQL", "Python"}', '{"Tableau", "PowerBI"}'),
    (3, 'DevOps Engineer', 'Manage and automate infrastructure', 'devops', 'open', '{"AWS", "Docker"}', '{"Kubernetes", "Terraform"}'),
    (4, 'Product Manager', 'Define and manage product roadmap', 'pm', 'closed', '{"Agile", "Jira"}', '{"Lean Startup", "Design Thinking"}');

INSERT INTO public."APPLICATION" (opening_id, email, name, phone, semesters_until_completion, current_semester, course_enrolled, major_enrolled, cover_letter, skills)
VALUES
    (1, 'applicant1@example.com', 'Michael Johnson', '1234567890', 2, 6, 'Computer Science', 'Software Engineering', 'I am passionate about...', '{"JavaScript", "React", "Node.js"}'),
    (1, 'applicant2@example.com', 'Emily Davis', '9876543210', 4, 4, 'Computer Science', 'Software Engineering', 'I have experience in...', '{"JavaScript", "React"}'),
    (2, 'applicant3@example.com', 'David Wilson', '5555555555', 3, 5, 'Design', 'UI/UX', 'My design philosophy is...', '{"Adobe XD", "Figma", "Prototyping"}'),
    (3, 'applicant4@example.com', 'Sophia Martinez', '1111111111', 2, 6, 'Data Science', 'Data Analytics', 'I am skilled in...', '{"SQL", "Python", "Tableau"}'),
    (4, 'applicant5@example.com', 'Daniel Thompson', '2222222222', 1, 7, 'Computer Science', 'DevOps', 'I have a strong background in...', '{"AWS", "Docker", "Kubernetes"}');