-- Drop the trigger
DROP TRIGGER IF EXISTS verify_email_domain_trigger ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.verify_email_domain();

-- Function to verify the email domain and existence
CREATE OR REPLACE FUNCTION public.verify_email_domain() 
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
AS $$
BEGIN
    -- Check if the email domain is correct
    IF (NEW.email ILIKE '%@student.monash.edu') THEN
         RETURN NEW;
    ELSE
        -- If the email domain is incorrect, raise an exception to prevent the insertion
        RAISE EXCEPTION 'Wrong email domain.';
    END IF;
END;
$$;

-- Create a trigger to run the function before each insert operation on auth.users
CREATE TRIGGER verify_email_domain_trigger 
BEFORE INSERT ON auth.users 
FOR EACH ROW 
EXECUTE FUNCTION public.verify_email_domain();

-- function to create a new profile entry for a new user

-- Drop the trigger
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.create_profile();

-- Function to create a new profile entry for a new user
CREATE OR REPLACE FUNCTION public.create_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert a new profile entry for the new user
    IF EXISTS (SELECT 1 FROM public."PROFILE" WHERE email = NEW.email) THEN
        UPDATE public."PROFILE" SET user_id = NEW.id WHERE email = NEW.email;
    ELSE
        INSERT INTO public."PROFILE" (user_id, email)
        VALUES (NEW.id, NEW.email);
    END IF;

    RETURN NEW;
END;
$$;

-- Create a trigger to run the function after each insert operation on auth.users
CREATE TRIGGER create_profile_trigger
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile();


-- +++++++++ POSTGRES VIEWS +++++++++

-- Drop the existing view
DROP VIEW IF EXISTS rec_rounds_with_openings_count;

-- Create the new view
CREATE OR REPLACE VIEW rec_rounds_with_openings_count AS
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

-- Function to get all openings with application count

DROP VIEW IF EXISTS openings_with_application_count;

CREATE OR REPLACE VIEW openings_with_application_count AS
SELECT
    o.id AS id,
    o.recruitment_round_id,
    o.title AS opening_title,
    o.description AS opening_description,
    o.status AS opening_status,
    o.required_skills AS opening_required_skills,
    o.desired_skills AS opening_desired_skills,
    o.task_email_format AS opening_task_email_format,
    o.task_enabled AS opening_task_enabled,
    COALESCE(ac.applications_count, 0) AS applications_count,
    COALESCE(ar.pending_review_count, 0) AS pending_review_count,
    st.name AS student_team_name,
    st.description AS student_team_description,
    p.email AS owner_email,
    rr.deadline AS recruitment_round_deadline,
    rr.semester AS recruitment_round_semester,
    rr.year AS recruitment_round_year
FROM
    public."OPENING" o
LEFT JOIN
    (
        SELECT
            opening_id,
            COUNT(*) AS applications_count
        FROM
            public."APPLICATION"
        GROUP BY
            opening_id
    ) ac ON o.id = ac.opening_id
LEFT JOIN
    (
        SELECT
            opening_id,
            COUNT(*) AS pending_review_count
        FROM
            public."APPLICATION"
        WHERE
            status IN ('A', 'C')
        GROUP BY
            opening_id
    ) ar ON o.id = ar.opening_id
JOIN
    public."RECRUITMENT_ROUND" rr ON o.recruitment_round_id = rr.id
JOIN
    public."STUDENT_TEAM" st ON rr.student_team_id = st.id
JOIN 
    (
    SELECT
        profile_id,
        student_team_id,
        role
    FROM
        public."PROFILE_TEAM_INFO"
    ) pti ON st.id = pti.student_team_id AND pti.role = 'O'
JOIN 
    (
        SELECT
            email,
            id
        FROM
            public."PROFILE"
    ) p ON pti.profile_id = p.id;


-- Function to get all student teams with roles and owners

DROP VIEW IF EXISTS student_teams_with_roles_and_owners;

CREATE OR REPLACE VIEW student_teams_with_roles_and_owners AS
SELECT 
    st.id AS student_team_id,
    st.name AS student_team_name,
    st.description AS student_team_description,
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

-- View to get allocated members for a student team
DROP VIEW IF EXISTS allocated_members_for_student_team;

CREATE OR REPLACE VIEW allocated_members_for_student_team AS
SELECT
    rr.semester || ' ' || rr.year AS round_name,
    o.title AS opening_name,
    COUNT(tla.id) AS team_leads_allocated,
    rr.student_team_id,
    o.id AS opening_id
FROM
    public."RECRUITMENT_ROUND" rr
JOIN
    public."OPENING" o ON rr.id = o.recruitment_round_id
LEFT JOIN
    public."TEAM_LEAD_ASSIGNMENT" tla ON o.id = tla.opening_id
GROUP BY
    rr.semester || ' ' || rr.year,
    o.title,
    rr.student_team_id,
    o.id;
