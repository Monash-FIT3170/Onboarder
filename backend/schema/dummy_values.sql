INSERT INTO public."PROFILE" (user_id, email, interview_availability) VALUES
    ('4942ad29-ead5-4f65-931b-56309d72c742', 'hmoh0035@student.monash.edu', ARRAY['Tuesday 1 PM - 4 PM']),
    ('0b33680d-c20b-444f-bacb-628b91930bfd', 'jcru0005@student.monash.edu', ARRAY['Tuesday 1 PM - 4 PM']),
    ('c8bdc042-5ba3-40ae-8a64-fedba340e12c', 'sbaj0015@student.monash.edu', ARRAY['Tuesday 1 PM - 4 PM']),
    ('67bc20e4-4928-475c-9a65-bd6a0a89498b', 'tsax0001@student.monash.edu', ARRAY['Tuesday 1 PM - 4 PM']),
    ('9ffd05fa-0d5c-4cfc-a3cd-616da0a74136', 'rsax0001@student.monash.edu', ARRAY['Tuesday 1 PM - 4 PM']),
    ('72c94e2f-1778-43d0-b62f-c142edab9e68', 'nhuy0018@student.monash.edu', ARRAY['Tuesday 1 PM - 4 PM']);

INSERT INTO public."STUDENT_TEAM" (name, description) VALUES
    ('Team Alpha', 'Software Development Team'),
    ('Team Bravo', 'Data Analysis Team'),
    ('Team Charlie', 'Project Management Team'),
    ('Team Delta', 'DevOps Team');

INSERT INTO public."PROFILE_TEAM_INFO" (profile_id, student_team_id, role) VALUES
    -- fass0001@student.monash.edu
    (1, 1, 'O'),  -- Owner of Team Alpha
    (1, 2, 'A'),  -- Admin of Team Bravo
    (1, 3, 'T'),  -- Team Lead of Team Charlie
    (1, 4, 'A'),  -- Admin of Team Delta

    -- rsax0001@student.monash.edu
    (2, 1, 'T'),  -- Team Lead of Team Alpha
    (2, 2, 'O'),  -- Owner of Team Bravo
    (2, 3, 'A'),  -- Admin of Team Charlie
    (2, 4, 'T'),  -- Team Lead of Team Delta

    -- hmoh0035@student.monash.edu
    (3, 1, 'A'),  -- Admin of Team Alpha
    (3, 2, 'T'),  -- Team Lead of Team Bravo
    (3, 3, 'O'),  -- Owner of Team Charlie
    (3, 4, 'A'),  -- Admin of Team Delta

    -- jcru0005@student.monash.edu
    (4, 1, 'T'),  -- Team Lead of Team Alpha
    (4, 2, 'A'),  -- Admin of Team Bravo
    (4, 3, 'T'),  -- Team Lead of Team Charlie
    (4, 4, 'O');  -- Owner of Team Delta
    

INSERT INTO public."RECRUITMENT_ROUND" (student_team_id, semester, year, deadline, status) VALUES
    -- Team Alpha (id: 1)
    (1, 'S1', 2023, '2023-03-15 23:59:59+11:00', 'R'),  -- Archived
    (1, 'S2', 2023, '2023-08-15 23:59:59+10:00', 'R'),  -- Archived
    (1, 'S2', 2024, '2024-09-30 23:59:59+10:00', 'A'),  -- Active
    (1, 'S1', 2025, '2025-03-15 23:59:59+11:00', 'I'),  -- Inactive (future)

    -- Team Bravo (id: 2)
    (2, 'S1', 2023, '2023-03-20 23:59:59+11:00', 'R'),  -- Archived
    (2, 'S2', 2023, '2023-08-20 23:59:59+10:00', 'R'),  -- Archived
    (2, 'S2', 2024, '2024-10-05 23:59:59+11:00', 'A'),  -- Active
    (2, 'S1', 2025, '2025-03-20 23:59:59+11:00', 'I'),  -- Inactive (future)

    -- Team Charlie (id: 3)
    (3, 'S1', 2023, '2023-03-25 23:59:59+11:00', 'R'),  -- Archived
    (3, 'S2', 2023, '2023-08-25 23:59:59+10:00', 'R'),  -- Archived
    (3, 'S2', 2024, '2024-10-10 23:59:59+11:00', 'A'),  -- Active
    (3, 'S1', 2025, '2025-03-25 23:59:59+11:00', 'I'),  -- Inactive (future)

    -- Team Delta (id: 4)
    (4, 'S1', 2023, '2023-03-30 23:59:59+11:00', 'R'),  -- Archived
    (4, 'S2', 2023, '2023-08-30 23:59:59+10:00', 'R'),  -- Archived
    (4, 'S2', 2024, '2024-10-15 23:59:59+11:00', 'A'),  -- Active
    (4, 'S1', 2025, '2025-03-30 23:59:59+11:00', 'I');  -- Inactive (future)
    

INSERT INTO public."OPENING" (recruitment_round_id, title, description, status, required_skills, desired_skills, task_email_format, task_enabled, interview_allocation_status) VALUES
    -- Team Alpha, S1 2023 (Archived)
    (1, 'Junior Developer', 'Entry-level software development position', 'R', ARRAY['Java', 'Git'], ARRAY['Spring Boot', 'REST APIs'], 'Please complete the coding task: {}', TRUE, 'S'),
    (1, 'UI/UX Designer', 'Design user interfaces for web applications', 'R', ARRAY['Figma', 'Adobe XD'], ARRAY['HTML', 'CSS'], 'Create a mockup for: {}', TRUE, 'S'),
    (1, 'Data Analyst', 'Entry-level data analysis role', 'R', ARRAY['Python', 'SQL'], ARRAY['Tableau', 'R'], 'Analyze the following dataset: {}', TRUE, 'S'),
    (1, 'QA Tester', 'Software testing and quality assurance', 'R', ARRAY['Selenium', 'JUnit'], ARRAY['Jenkins', 'JIRA'], 'Develop test cases for: {}', FALSE, 'S'),
    (1, 'Technical Writer', 'Create documentation for software projects', 'R', ARRAY['Markdown', 'Technical Writing'], ARRAY['DITA', 'API Documentation'], 'Write a user guide for: {}', FALSE, 'S'),

    -- Team Alpha, S2 2023 (Archived)
    (2, 'Frontend Developer', 'Build responsive web applications', 'R', ARRAY['JavaScript', 'React'], ARRAY['TypeScript', 'Redux'], 'Implement a React component for: {}', TRUE, 'S'),
    (2, 'Backend Developer', 'Develop server-side applications', 'R', ARRAY['Node.js', 'Express'], ARRAY['MongoDB', 'GraphQL'], 'Create an API endpoint for: {}', TRUE, 'S'),
    (2, 'DevOps Engineer', 'Manage CI/CD pipelines and infrastructure', 'R', ARRAY['Docker', 'Kubernetes'], ARRAY['AWS', 'Terraform'], 'Set up a deployment pipeline for: {}', FALSE, 'S'),
    (2, 'Machine Learning Engineer', 'Develop and deploy ML models', 'R', ARRAY['Python', 'TensorFlow'], ARRAY['PyTorch', 'Scikit-learn'], 'Train a model to predict: {}', TRUE, 'S'),
    (2, 'Product Manager', 'Oversee product development lifecycle', 'R', ARRAY['Agile', 'Jira'], ARRAY['SQL', 'Data Analysis'], 'Create a product roadmap for: {}', FALSE, 'S'),

    -- Team Alpha, S2 2024 (Active)
    (3, 'Full Stack Developer', 'End-to-end web application development', 'A', ARRAY['JavaScript', 'Python', 'SQL'], ARRAY['React', 'Django', 'PostgreSQL'], 'Build a full-stack app for: {}', TRUE, 'N'),
    (3, 'Mobile App Developer', 'Develop cross-platform mobile applications', 'A', ARRAY['React Native', 'JavaScript'], ARRAY['iOS', 'Android'], 'Create a mobile app prototype for: {}', TRUE, 'N'),
    (3, 'Cloud Architect', 'Design and implement cloud solutions', 'A', ARRAY['AWS', 'Azure'], ARRAY['GCP', 'Serverless'], 'Architect a cloud solution for: {}', FALSE, 'N'),
    (3, 'Data Engineer', 'Build data pipelines and infrastructure', 'A', ARRAY['Python', 'SQL', 'Airflow'], ARRAY['Spark', 'Kafka'], 'Design a data pipeline for: {}', TRUE, 'N'),
    (3, 'Security Analyst', 'Implement and maintain cybersecurity measures', 'A', ARRAY['Network Security', 'Penetration Testing'], ARRAY['SIEM', 'Ethical Hacking'], 'Perform a security audit on: {}', FALSE, 'N'),

    -- Team Alpha, S1 2025 (Inactive, Future)
    (4, 'AI Research Intern', 'Assist in cutting-edge AI research projects', 'I', ARRAY['Python', 'Machine Learning'], ARRAY['NLP', 'Computer Vision'], 'Propose a research project on: {}', TRUE, 'N'),
    (4, 'Blockchain Developer', 'Develop decentralized applications', 'I', ARRAY['Solidity', 'Ethereum'], ARRAY['Web3.js', 'Smart Contracts'], 'Create a simple smart contract for: {}', TRUE, 'N'),
    (4, 'VR/AR Developer', 'Create immersive virtual and augmented reality experiences', 'I', ARRAY['Unity', 'C#'], ARRAY['AR Kit', 'VR Hardware'], 'Design a VR/AR prototype for: {}', TRUE, 'N'),
    (4, 'Quantum Computing Researcher', 'Explore quantum algorithms and applications', 'I', ARRAY['Quantum Mechanics', 'Linear Algebra'], ARRAY['Qiskit', 'Q#'], 'Simulate a quantum circuit for: {}', FALSE, 'N'),
    (4, 'Robotics Engineer', 'Design and program autonomous robots', 'I', ARRAY['ROS', 'C++'], ARRAY['Computer Vision', 'Sensor Fusion'], 'Program a robot to perform: {}', TRUE, 'N'),

    -- Team Bravo, S1 2023 (Archived)
    (5, 'Data Scientist', 'Analyze complex datasets and build predictive models', 'R', ARRAY['Python', 'R', 'Machine Learning'], ARRAY['Deep Learning', 'NLP'], 'Develop a predictive model for: {}', TRUE, 'S'),
    (5, 'Business Intelligence Analyst', 'Create reports and dashboards for decision-making', 'R', ARRAY['SQL', 'Tableau'], ARRAY['Power BI', 'Excel'], 'Design a dashboard for: {}', TRUE, 'S'),
    (5, 'Data Engineer', 'Build and maintain data pipelines', 'R', ARRAY['Python', 'SQL', 'ETL'], ARRAY['Apache Spark', 'Airflow'], 'Implement a data pipeline for: {}', TRUE, 'S'),
    (5, 'Statistical Analyst', 'Perform statistical analysis on various datasets', 'R', ARRAY['R', 'SPSS'], ARRAY['SAS', 'Stata'], 'Conduct statistical analysis on: {}', FALSE, 'S'),
    (5, 'Data Visualization Specialist', 'Create compelling visual representations of data', 'R', ARRAY['D3.js', 'Tableau'], ARRAY['Adobe Illustrator', 'Python'], 'Visualize the following dataset: {}', TRUE, 'S'),

    -- Team Bravo, S2 2023 (Archived)
    (6, 'Machine Learning Engineer', 'Develop and deploy machine learning models', 'R', ARRAY['Python', 'TensorFlow', 'Scikit-learn'], ARRAY['Keras', 'PyTorch'], 'Build an ML model to predict: {}', TRUE, 'S'),
    (6, 'Big Data Architect', 'Design scalable big data solutions', 'R', ARRAY['Hadoop', 'Spark'], ARRAY['Hive', 'Cassandra'], 'Architect a big data solution for: {}', FALSE, 'S'),
    (6, 'Data Governance Specialist', 'Implement data governance policies and procedures', 'R', ARRAY['Data Management', 'Compliance'], ARRAY['GDPR', 'Data Quality'], 'Create a data governance plan for: {}', FALSE, 'S'),
    (6, 'Natural Language Processing Engineer', 'Develop NLP models and applications', 'R', ARRAY['Python', 'NLTK', 'SpaCy'], ARRAY['Transformers', 'Bert'], 'Implement an NLP solution for: {}', TRUE, 'S'),
    (6, 'Time Series Analyst', 'Analyze and forecast time-based data', 'R', ARRAY['Python', 'Statsmodels'], ARRAY['Prophet', 'ARIMA'], 'Forecast the following time series: {}', TRUE, 'S'),

    -- Team Bravo, S2 2024 (Active)
    (7, 'AI Ethics Researcher', 'Investigate ethical implications of AI systems', 'A', ARRAY['AI', 'Ethics', 'Research Methods'], ARRAY['Philosophy', 'Policy Analysis'], 'Analyze the ethical implications of: {}', FALSE, 'N'),
    (7, 'Computer Vision Specialist', 'Develop image and video analysis solutions', 'A', ARRAY['Python', 'OpenCV', 'Deep Learning'], ARRAY['TensorFlow', 'YOLO'], 'Create a computer vision model for: {}', TRUE, 'N'),
    (7, 'Data Privacy Officer', 'Ensure compliance with data protection regulations', 'A', ARRAY['GDPR', 'Data Protection'], ARRAY['CCPA', 'ISO 27001'], 'Develop a privacy policy for: {}', FALSE, 'N'),
    (7, 'Quantum Machine Learning Researcher', 'Explore quantum approaches to machine learning', 'A', ARRAY['Quantum Computing', 'Machine Learning'], ARRAY['Qiskit', 'PennyLane'], 'Design a quantum ML algorithm for: {}', TRUE, 'N'),
    (7, 'Edge Computing Analyst', 'Implement data analysis solutions for edge devices', 'A', ARRAY['IoT', 'Edge Computing', 'Python'], ARRAY['TensorFlow Lite', 'Raspberry Pi'], 'Develop an edge analytics solution for: {}', TRUE, 'N'),

    -- Team Bravo, S1 2025 (Inactive, Future)
    (8, 'Augmented Analytics Specialist', 'Develop AI-driven analytics tools', 'I', ARRAY['Machine Learning', 'Data Visualization'], ARRAY['AutoML', 'NLP'], 'Design an augmented analytics tool for: {}', TRUE, 'N'),
    (8, 'Robotics Data Scientist', 'Analyze data from robotic systems', 'I', ARRAY['Python', 'ROS', 'Machine Learning'], ARRAY['Computer Vision', 'Sensor Fusion'], 'Create a data analysis pipeline for robots that: {}', TRUE, 'N'),
    (8, 'Bioinformatics Analyst', 'Analyze biological data using computational methods', 'I', ARRAY['Python', 'R', 'Bioinformatics'], ARRAY['Genomics', 'Proteomics'], 'Analyze the following genomic dataset: {}', FALSE, 'N'),
    (8, 'Federated Learning Engineer', 'Develop privacy-preserving machine learning systems', 'I', ARRAY['Python', 'Machine Learning', 'Cryptography'], ARRAY['TensorFlow Federated', 'PySyft'], 'Implement a federated learning system for: {}', TRUE, 'N'),
    (8, 'Explainable AI Developer', 'Create interpretable AI models and explanations', 'I', ARRAY['Python', 'Machine Learning', 'SHAP'], ARRAY['LIME', 'InterpretML'], 'Develop an explainable AI model for: {}', TRUE, 'N'),

    -- Team Charlie, S1 2023 (Archived)
    (9, 'Junior Project Manager', 'Assist in managing software development projects', 'R', ARRAY['Agile', 'Jira'], ARRAY['Scrum', 'MS Project'], 'Create a project plan for: {}', TRUE, 'S'),
    (9, 'Business Analyst', 'Analyze business processes and requirements', 'R', ARRAY['Requirements Gathering', 'UML'], ARRAY['SQL', 'Tableau'], 'Perform a business analysis for: {}', TRUE, 'S'),
    (9, 'Scrum Master', 'Facilitate Agile processes and team collaboration', 'R', ARRAY['Scrum', 'Agile'], ARRAY['Kanban', 'Confluence'], 'Design a sprint plan for: {}', FALSE, 'S'),
    (9, 'Product Owner', 'Manage product backlog and prioritize features', 'R', ARRAY['Product Management', 'User Stories'], ARRAY['Agile', 'Market Research'], 'Develop a product roadmap for: {}', TRUE, 'S'),
    (9, 'Change Management Specialist', 'Facilitate organizational changes', 'R', ARRAY['Change Management', 'Stakeholder Management'], ARRAY['ADKAR Model', 'Prosci'], 'Create a change management plan for: {}', FALSE, 'S'),

    -- Team Charlie, S2 2023 (Archived)
    (10, 'Technical Project Manager', 'Lead complex technical projects', 'R', ARRAY['Project Management', 'Software Development'], ARRAY['DevOps', 'Cloud Technologies'], 'Develop a project execution plan for: {}', TRUE, 'S'),
    (10, 'Agile Coach', 'Guide teams in Agile methodologies', 'R', ARRAY['Agile', 'Coaching'], ARRAY['SAFe', 'LeSS'], 'Design an Agile transformation plan for: {}', TRUE, 'S'),
    (10, 'Risk Management Specialist', 'Identify and mitigate project risks', 'R', ARRAY['Risk Management', 'PMBOK'], ARRAY['Monte Carlo Simulation', 'Decision Trees'], 'Conduct a risk assessment for: {}', FALSE, 'S'),
    (10, 'Quality Assurance Manager', 'Oversee software quality processes', 'R', ARRAY['QA Methodologies', 'Test Planning'], ARRAY['Automated Testing', 'Performance Testing'], 'Develop a QA strategy for: {}', TRUE, 'S'),
    (10, 'Program Manager', 'Coordinate multiple related projects', 'R', ARRAY['Program Management', 'Strategic Planning'], ARRAY['Portfolio Management', 'Budgeting'], 'Create a program management plan for: {}', FALSE, 'S'),

    -- Team Charlie, S2 2024 (Active)
    (11, 'Digital Transformation Manager', 'Lead digital transformation initiatives', 'A', ARRAY['Change Management', 'Digital Technologies'], ARRAY['AI/ML', 'Cloud Computing'], 'Propose a digital transformation strategy for: {}', TRUE, 'N'),
    (11, 'Agile Portfolio Manager', 'Manage portfolio of Agile projects', 'A', ARRAY['Portfolio Management', 'Agile'], ARRAY['SAFe', 'Financial Planning'], 'Develop an Agile portfolio plan for: {}', TRUE, 'N'),
    (11, 'Project Management Office (PMO) Analyst', 'Support PMO operations and project governance', 'A', ARRAY['PMO', 'Project Management'], ARRAY['Data Analysis', 'Process Improvement'], 'Design a PMO dashboard for: {}', FALSE, 'N'),
    (11, 'Lean Six Sigma Specialist', 'Implement process improvement initiatives', 'A', ARRAY['Lean', 'Six Sigma'], ARRAY['Process Mapping', 'Statistical Analysis'], 'Conduct a process improvement analysis for: {}', TRUE, 'N'),
    (11, 'Stakeholder Engagement Manager', 'Manage relationships with project stakeholders', 'A', ARRAY['Stakeholder Management', 'Communication'], ARRAY['Conflict Resolution', 'Negotiation'], 'Create a stakeholder engagement plan for: {}', FALSE, 'N'),

    -- Team Charlie, S1 2025 (Inactive, Future)
    (12, 'AI Project Manager', 'Manage AI and machine learning projects', 'I', ARRAY['Project Management', 'AI/ML'], ARRAY['Data Science', 'Ethics in AI'], 'Develop a project plan for an AI initiative: {}', TRUE, 'N'),
    (12, 'Sustainability Project Coordinator', 'Coordinate sustainability-focused projects', 'I', ARRAY['Project Management', 'Sustainability'], ARRAY['Environmental Science', 'CSR'], 'Create a sustainability project proposal for: {}', TRUE, 'N'),
    (12, 'Remote Team Management Specialist', 'Optimize management of distributed teams', 'I', ARRAY['Remote Team Management', 'Collaboration Tools'], ARRAY['Cultural Intelligence', 'Virtual Team Building'], 'Design a remote work policy for: {}', FALSE, 'N'),
    (12, 'Innovation Program Manager', 'Lead programs fostering innovation', 'I', ARRAY['Innovation Management', 'Design Thinking'], ARRAY['Agile', 'R&D Management'], 'Develop an innovation program for: {}', TRUE, 'N'),
    (12, 'Blockchain Project Manager', 'Manage blockchain implementation projects', 'I', ARRAY['Project Management', 'Blockchain'], ARRAY['Cryptocurrency', 'Smart Contracts'], 'Create a blockchain implementation plan for: {}', TRUE, 'N'),

    -- Team Delta, S1 2023 (Archived)
    (13, 'Junior DevOps Engineer', 'Assist in implementing and maintaining CI/CD pipelines', 'R', ARRAY['Linux', 'Git'], ARRAY['Docker', 'Jenkins'], 'Set up a basic CI/CD pipeline for: {}', TRUE, 'S'),
    (13, 'Cloud Infrastructure Specialist', 'Manage and optimize cloud-based infrastructure', 'R', ARRAY['AWS', 'Terraform'], ARRAY['Azure', 'GCP'], 'Design a cloud architecture for: {}', TRUE, 'S'),
    (13, 'Site Reliability Engineer (SRE)', 'Ensure reliability and performance of systems', 'R', ARRAY['Linux', 'Monitoring Tools'], ARRAY['Kubernetes', 'Prometheus'], 'Develop an SRE strategy for: {}', FALSE, 'S'),
    (13, 'Automation Engineer', 'Develop scripts and tools for process automation', 'R', ARRAY['Python', 'Bash'], ARRAY['Ansible', 'Puppet'], 'Automate the following process: {}', TRUE, 'S'),
    (13, 'Network Operations Specialist', 'Manage and troubleshoot network infrastructure', 'R', ARRAY['Networking', 'Firewalls'], ARRAY['SDN', 'Network Automation'], 'Design a network topology for: {}', FALSE, 'S'),

    -- Team Delta, S2 2023 (Archived)
    (14, 'Senior DevOps Engineer', 'Lead DevOps practices and culture adoption', 'R', ARRAY['Kubernetes', 'CI/CD'], ARRAY['Istio', 'Helm'], 'Implement a microservices architecture for: {}', TRUE, 'S'),
    (14, 'Security Operations (SecOps) Engineer', 'Integrate security into DevOps processes', 'R', ARRAY['Security', 'DevSecOps'], ARRAY['Penetration Testing', 'SAST/DAST'], 'Develop a SecOps strategy for: {}', TRUE, 'S'),
    (14, 'Platform Engineer', 'Build and maintain scalable platforms', 'R', ARRAY['Kubernetes', 'IaC'], ARRAY['Service Mesh', 'API Gateways'], 'Design a platform solution for: {}', FALSE, 'S'),
    (14, 'Database Reliability Engineer', 'Ensure reliability and performance of databases', 'R', ARRAY['SQL', 'NoSQL'], ARRAY['Database Optimization', 'Sharding'], 'Optimize the following database setup: {}', TRUE, 'S'),
    (14, 'Configuration Management Specialist', 'Manage system configurations across environments', 'R', ARRAY['Ansible', 'Puppet'], ARRAY['Chef', 'SaltStack'], 'Implement a configuration management solution for: {}', FALSE, 'S'),

    -- Team Delta, S2 2024 (Active)
    (15, 'Edge Computing DevOps Engineer', 'Implement DevOps practices for edge computing', 'A', ARRAY['Edge Computing', 'IoT'], ARRAY['Kubernetes Edge', '5G'], 'Develop an edge computing deployment strategy for: {}', TRUE, 'N'),
    (15, 'FinOps Specialist', 'Optimize cloud costs and financial operations', 'A', ARRAY['Cloud Cost Management', 'Financial Analysis'], ARRAY['AWS Cost Explorer', 'GCP Cost Management'], 'Create a FinOps strategy for: {}', TRUE, 'N'),
    (15, 'Chaos Engineer', 'Design and implement chaos engineering practices', 'A', ARRAY['Chaos Engineering', 'Resilience Testing'], ARRAY['Chaos Monkey', 'Gremlin'], 'Design a chaos experiment for: {}', FALSE, 'N'),
    (15, 'GitOps Specialist', 'Implement GitOps practices and tools', 'A', ARRAY['Git', 'CI/CD'], ARRAY['ArgoCD', 'Flux'], 'Develop a GitOps workflow for: {}', TRUE, 'N'),
    (15, 'AIOps Engineer', 'Implement AI-driven IT operations', 'A', ARRAY['Machine Learning', 'IT Operations'], ARRAY['Predictive Analytics', 'Anomaly Detection'], 'Design an AIOps solution for: {}', FALSE, 'N'),

    -- Team Delta, S1 2025 (Inactive, Future)
    (16, 'Quantum Computing Operations Specialist', 'Manage and optimize quantum computing infrastructure', 'I', ARRAY['Quantum Computing', 'Cloud Platforms'], ARRAY['Qiskit', 'Cirq'], 'Develop an operational plan for quantum computing resources: {}', TRUE, 'N'),
    (16, 'Green DevOps Engineer', 'Implement environmentally sustainable DevOps practices', 'I', ARRAY['DevOps', 'Green Computing'], ARRAY['Energy Efficient Algorithms', 'Sustainable Cloud'], 'Create a green DevOps strategy for: {}', TRUE, 'N'),
    (16, 'DevOps Anthropologist', 'Analyze and optimize DevOps culture and practices', 'I', ARRAY['DevOps', 'Organizational Psychology'], ARRAY['Cultural Analysis', 'Change Management'], 'Conduct a DevOps culture assessment for: {}', FALSE, 'N'),
    (16, 'Serverless Operations Architect', 'Design and implement serverless architectures', 'I', ARRAY['Serverless', 'FaaS'], ARRAY['AWS Lambda', 'Azure Functions'], 'Architect a serverless solution for: {}', TRUE, 'N'),
    (16, 'DevOps AI Ethicist', 'Ensure ethical AI practices in DevOps processes', 'I', ARRAY['AI Ethics', 'DevOps'], ARRAY['Responsible AI', 'Fairness in ML'], 'Develop an AI ethics framework for DevOps practices in: {}', TRUE, 'N');


INSERT INTO public."TEAM_LEAD_ASSIGNMENT" (opening_id, profile_id)
SELECT 
    o.id AS opening_id,
    p.id AS profile_id
FROM 
    public."OPENING" o
    CROSS JOIN (
        SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn 
        FROM public."PROFILE"
    ) p
WHERE 
    o.id % 4 = p.rn % 4;

-- Function to generate multiple random applications
CREATE OR REPLACE FUNCTION generate_random_applications(opening_id BIGINT, opening_title VARCHAR, num_applications INTEGER)
RETURNS TABLE (
    email VARCHAR,
    name VARCHAR,
    phone VARCHAR,
    semesters_until_completion INTEGER,
    course_name VARCHAR,
    current_semester INTEGER,
    major_enrolled VARCHAR,
    additional_info TEXT,
    skills VARCHAR[],
    candidate_availability VARCHAR[],
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_notes VARCHAR,
    interview_score INTEGER,
    status VARCHAR(1),
    profile_id BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ('applicant' || floor(random() * 1000000)::text || '@example.com')::VARCHAR AS email,
        ((ARRAY['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Daniel', 'Olivia', 'Matthew', 'Sophia'])[floor(random() * 10 + 1)] || ' ' ||
        (ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'])[floor(random() * 10 + 1)])::VARCHAR AS name,
        ('+1-' || floor(random() * 900 + 100)::text || '-' || floor(random() * 900 + 100)::text || '-' || floor(random() * 9000 + 1000)::text)::VARCHAR AS phone,
        floor(random() * 6 + 1)::INTEGER AS semesters_until_completion,
        'Computer Science'::VARCHAR AS course_name,
        floor(random() * 8 + 1)::INTEGER AS current_semester,
        (CASE
            WHEN opening_title LIKE '%Data%' THEN 'Data Science'
            WHEN opening_title LIKE '%Project%' THEN 'Business Administration'
            ELSE 'Computer Science'
        END)::VARCHAR AS major_enrolled,
        ('Interested in ' || opening_title || ' role')::TEXT AS additional_info,
        ARRAY[
            (ARRAY['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'R', 'Git', 'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'Data Analysis', 'Agile', 'Scrum'])[floor(random() * 14 + 1)],
            (ARRAY['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'R', 'Git', 'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'Data Analysis', 'Agile', 'Scrum'])[floor(random() * 14 + 1)]
        ]::VARCHAR[] AS skills,
        ARRAY['Weekdays 9 AM - 5 PM', 'Weekends 10 AM - 4 PM', 'Evenings 6 PM - 10 PM']::VARCHAR[] AS candidate_availability,
        (NOW() + (random() * INTERVAL '30 days'))::TIMESTAMP WITH TIME ZONE AS interview_date,
        ((ARRAY['Excellent communication skills', 'Strong technical background', 'Good problem-solving abilities', 'Enthusiastic learner', 'Team player'])[floor(random() * 5 + 1)])::VARCHAR AS interview_notes,
        floor(random() * 5 + 1)::INTEGER AS interview_score,
        ((ARRAY['A', 'C', 'R'])[floor(random() * 3 + 1)])::VARCHAR(1) AS status,
        (SELECT id FROM public."PROFILE" ORDER BY RANDOM() LIMIT 1) AS profile_id
    FROM generate_series(1, num_applications);
END;
$$ LANGUAGE plpgsql;

-- Generate 5 applications for each opening
DO $$
DECLARE
    opening_rec RECORD;
BEGIN
    FOR opening_rec IN SELECT id, title FROM public."OPENING" LOOP
        INSERT INTO public."APPLICATION" (
            opening_id, email, name, phone, semesters_until_completion, course_name,
            current_semester, major_enrolled, additional_info, skills, candidate_availability,
            interview_date, interview_notes, interview_score, status, profile_id
        )
        SELECT 
            opening_rec.id,
            email, name, phone, semesters_until_completion, course_name,
            current_semester, major_enrolled, additional_info, skills, candidate_availability,
            interview_date, interview_notes, interview_score, status, profile_id
        FROM generate_random_applications(opening_rec.id, opening_rec.title, 5)
        ON CONFLICT (opening_id, email) DO NOTHING;
    END LOOP;
END $$;

-- Clean up the function after use
DROP FUNCTION IF EXISTS generate_random_applications(BIGINT, VARCHAR, INTEGER);