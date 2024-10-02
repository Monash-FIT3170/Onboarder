-- Drop the existing view
DROP VIEW IF EXISTS rec_rounds_with_openings_count;

-- Create the new view
CREATE OR REPLACE VIEW rec_rounds_with_openings_count AS
SELECT
    rr.id,
    rr.student_team_id,
    rr.semester,
    rr.year,
    rr.application_deadline,
    rr.interview_preference_deadline,
    rr.interview_period,
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
    rr.application_deadline AS recruitment_round_deadline,
    rr.interview_preference_deadline  AS recruitment_round_interview_preference_deadline,
    rr.interview_period AS recruitment_round_interview_period,
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
