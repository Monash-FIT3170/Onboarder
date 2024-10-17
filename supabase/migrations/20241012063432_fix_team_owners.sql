-- Updated this to get role correctly 

DROP VIEW IF EXISTS student_teams_with_roles_and_owners;

CREATE OR REPLACE VIEW student_teams_with_roles_and_owners AS
SELECT 
    st.id AS student_team_id,
    st.name AS student_team_name,
    st.description AS student_team_description,
    st.meeting_link AS student_team_meeting_link,
    pti.role AS your_role,
    pti.profile_id,
    (SELECT p.email
     FROM public."PROFILE_TEAM_INFO" pti2
     JOIN public."PROFILE" p ON pti2.profile_id = p.id
     WHERE pti2.student_team_id = st.id AND pti2.role = 'O') AS owner_email
FROM 
    public."STUDENT_TEAM" st
JOIN 
    public."PROFILE_TEAM_INFO" pti ON st.id = pti.student_team_id;

-- Removed JOIN auth.users u ON p.user_id = u.id