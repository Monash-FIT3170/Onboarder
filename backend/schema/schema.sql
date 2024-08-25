-- Drop existing tables
DROP TABLE IF EXISTS public."APPLICATION" CASCADE;
DROP TABLE IF EXISTS public."OPENING" CASCADE;
DROP TABLE IF EXISTS public."STUDENT_TEAM" CASCADE;
DROP TABLE IF EXISTS public."RECRUITMENT_ROUND" CASCADE;
DROP TABLE IF EXISTS public."PROFILE" CASCADE;
DROP TABLE IF EXISTS public."PROFILE_TEAM_INFO" CASCADE;
DROP TABLE IF EXISTS public."TEAM_LEAD_ASSIGNMENT" CASCADE;

-- Create PROFILE table
CREATE TABLE public."PROFILE" (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY,
    user_id UUID NOT NULL,
    email VARCHAR NOT NULL,
    interview_availability VARCHAR[],
    CONSTRAINT PROFILE_pkey PRIMARY KEY (id),
    CONSTRAINT PROFILE_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
) TABLESPACE pg_default;

-- Create STUDENT_TEAM table
CREATE TABLE public."STUDENT_TEAM" (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY,
    name VARCHAR NOT NULL,
    description VARCHAR,
    CONSTRAINT STUDENT_TEAM_pkey PRIMARY KEY (id),
    CONSTRAINT STUDENT_TEAM_name_key UNIQUE (name)
) TABLESPACE pg_default;

-- Create PROFILE_TEAM_INFO table
CREATE TABLE public."PROFILE_TEAM_INFO" (
    profile_id BIGINT NOT NULL,
    student_team_id BIGINT NOT NULL,
    role VARCHAR(1) NOT NULL CHECK (role IN ('O', 'A', 'T')),
    CONSTRAINT PROFILE_TEAM_INFO_pkey PRIMARY KEY (profile_id, student_team_id),
    CONSTRAINT PROFILE_TEAM_INFO_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES "PROFILE" (id),
    CONSTRAINT PROFILE_TEAM_INFO_student_team_id_fkey FOREIGN KEY (student_team_id) REFERENCES "STUDENT_TEAM" (id)
) TABLESPACE pg_default;

-- Create RECRUITMENT_ROUND table
CREATE TABLE public."RECRUITMENT_ROUND" (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY,
    student_team_id BIGINT NOT NULL,
    semester VARCHAR NOT NULL,
    year BIGINT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(1) NOT NULL DEFAULT 'I' CHECK (status IN ('A', 'I', 'R')),
    CONSTRAINT RECRUITMENT_ROUND_pkey PRIMARY KEY (id),
    CONSTRAINT RECRUITMENT_ROUND_student_team_id_fkey FOREIGN KEY (student_team_id) REFERENCES "STUDENT_TEAM" (id)
) TABLESPACE pg_default;

-- Create OPENING table
CREATE TABLE public."OPENING" (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY,
    recruitment_round_id BIGINT NOT NULL,
    title VARCHAR NOT NULL,
    description VARCHAR,
    status VARCHAR(1) NOT NULL DEFAULT 'I' CHECK (status IN ('A', 'I', 'R')),
    required_skills VARCHAR[] NOT NULL,
    desired_skills VARCHAR[],
    task_email_format VARCHAR,
    task_enabled BOOLEAN,
    CONSTRAINT OPENING_pkey PRIMARY KEY (id),
    CONSTRAINT OPENING_recruitment_round_id_fkey FOREIGN KEY (recruitment_round_id) REFERENCES "RECRUITMENT_ROUND" (id)
) TABLESPACE pg_default;

-- Create TEAM_LEAD_ASSIGNMENT table
CREATE TABLE public."TEAM_LEAD_ASSIGNMENT" (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY,
    opening_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    CONSTRAINT TEAM_LEAD_ASSIGNMENT_pkey PRIMARY KEY (id),
    CONSTRAINT TEAM_LEAD_ASSIGNMENT_opening_id_fkey FOREIGN KEY (opening_id) REFERENCES "OPENING" (id),
    CONSTRAINT TEAM_LEAD_ASSIGNMENT_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES "PROFILE" (id)
) TABLESPACE pg_default;

-- Create APPLICATION table
CREATE TABLE public."APPLICATION" (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY,
    opening_id BIGINT NOT NULL,
    email VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    semesters_until_completion INTEGER NOT NULL,
    current_semester INTEGER NOT NULL,
    major_enrolled VARCHAR,
    additional_info TEXT,
    skills VARCHAR[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    candidate_availability VARCHAR[],
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_notes VARCHAR,
    status VARCHAR(1) NOT NULL DEFAULT 'I' CHECK (status IN ('A', 'C', 'R')),
    profile_id BIGINT,
    CONSTRAINT APPLICATION_pkey PRIMARY KEY (id),
    CONSTRAINT APPLICATION_opening_id_fkey FOREIGN KEY (opening_id) REFERENCES "OPENING" (id),
    CONSTRAINT APPLICATION_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES "PROFILE" (id)
) TABLESPACE pg_default;

-- +++++++++ POSTGRES FUNCTIONS +++++++++

-- Function to get all recruitment rounds with openings count

DROP FUNCTION IF EXISTS get_all_rec_rounds_with_openings_count();

CREATE OR REPLACE FUNCTION get_all_rec_rounds_with_openings_count()
RETURNS TABLE (
    id BIGINT,
    student_team_id BIGINT,
    semester VARCHAR,
    year BIGINT,
    deadline TIMESTAMP WITH TIME ZONE,
    status VARCHAR,
    openings_count BIGINT
)
AS $$
SELECT
    rr.id,
    rr.student_team_id,
    rr.semester,
    rr.year,
    rr.deadline,
    rr.status,
    COALESCE(oc.openings_count, 0) AS openings_count
FROM
    public."RECRUITMENT_ROUND" rr
LEFT JOIN
    (
        SELECT
            recruitment_round_id,
            COUNT(*) AS openings_count
        FROM
            public."OPENING"
        GROUP BY
            recruitment_round_id
    ) oc ON rr.id = oc.recruitment_round_id;
$$ LANGUAGE SQL;

-- Function to get all openings with application count

DROP FUNCTION IF EXISTS get_openings_with_application_count();

CREATE OR REPLACE FUNCTION get_openings_with_application_count()
RETURNS TABLE (
    id BIGINT,
    recruitment_round_id BIGINT,
    student_team_id BIGINT,
    title VARCHAR,
    description VARCHAR,
    status VARCHAR,
    required_skills VARCHAR[],
    desired_skills VARCHAR[],
    task_email_format VARCHAR,
    task_enabled BOOLEAN,
    applications_count BIGINT
)
LANGUAGE SQL
AS $$
    SELECT
        o.id,
        o.recruitment_round_id,
        rr.student_team_id, 
        o.title,
        o.description,
        o.status,
        o.required_skills,
        o.desired_skills,
        o.task_email_format,
        o.task_enabled,
        COALESCE(ac.applications_count, 0) AS applications_count
    FROM
        public."OPENING" o
    JOIN
        public."RECRUITMENT_ROUND" rr ON o.recruitment_round_id = rr.id 
    LEFT JOIN
        (
            SELECT
                opening_id,
                COUNT(*) AS applications_count
            FROM
                public."APPLICATION"
            GROUP BY
                opening_id
        ) ac ON o.id = ac.opening_id;
$$;

-- Function to get all student teams with roles and owners

DROP VIEW IF EXISTS student_teams_with_roles_and_owners;

CREATE OR REPLACE VIEW student_teams_with_roles_and_owners AS
SELECT 
    st.id AS student_team_id,
    st.name AS student_team_name,
    pti.role AS your_role,
    pti.profile_id,
    (SELECT u.email
     FROM public."PROFILE_TEAM_INFO" pti2
     JOIN public."PROFILE" p ON pti2.profile_id = p.id
     JOIN auth.users u ON p.user_id = u.id
     WHERE pti2.student_team_id = st.id AND pti2.role = 'O') AS owner_email
FROM 
    public."STUDENT_TEAM" st
JOIN 
    public."PROFILE_TEAM_INFO" pti ON st.id = pti.student_team_id;
