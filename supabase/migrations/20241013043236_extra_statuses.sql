-- To keep track of the status of the calendar invites
ALTER TABLE public."OPENING"
ADD COLUMN calendar_invites_sent BOOLEAN DEFAULT FALSE;

-- Function to get all openings with application count

-- Added calendar_invites_sent to the view
-- Added interview_allocation_status to the view

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
    o.calendar_invites_sent AS calendar_invites_sent,
    o.interview_allocation_status AS interview_allocation_status,
    COALESCE(ac.applications_count, 0) AS applications_count,
    COALESCE(ar.pending_review_count, 0) AS pending_review_count,
    st.name AS student_team_name,
    st.description AS student_team_description,
    p.email AS owner_email,
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
