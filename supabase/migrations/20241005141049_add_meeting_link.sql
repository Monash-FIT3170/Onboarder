ALTER TABLE IF EXISTS public."STUDENT_TEAM"
ADD COLUMN meeting_link VARCHAR DEFAULT '';

-- Function to get all student teams with roles and owners

DROP VIEW IF EXISTS student_teams_with_roles_and_owners;

CREATE OR REPLACE VIEW student_teams_with_roles_and_owners AS
SELECT 
    st.id AS student_team_id,
    st.name AS student_team_name,
    st.description AS student_team_description,
    pti.role AS your_role,
    pti.profile_id,
    st.meeting_link as student_team_meeting_link,
    (SELECT u.email
     FROM public."PROFILE_TEAM_INFO" pti2
     JOIN public."PROFILE" p ON pti2.profile_id = p.id
     JOIN auth.users u ON p.user_id = u.id
     WHERE pti2.student_team_id = st.id AND pti2.role = 'O') AS owner_email
FROM 
    public."STUDENT_TEAM" st
JOIN 
    public."PROFILE_TEAM_INFO" pti ON st.id = pti.student_team_id;