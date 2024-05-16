-- RETURN THE SEMESTER AND YEAR FOR ALL OPENINGS UNDER ALL RECRUITMENT_ROUNDS

SELECT
    st.name AS student_team,
    rr.semester,
    rr.year,
    o.title,
FROM 
    public."RECRUITMENT_ROUND" rr
        JOIN 
            public."STUDENT_TEAM" st ON rr.student_team_id = st.id
        LEFT 
            JOIN public."OPENING" o ON o.recruitment_round_ID = rr.id;

-- RETURN THE STUDENT TEAM FOR ALL RECRUITMENT_ROUNDS

SELECT
    st.name AS student_team
    rr.semester as semester
    rr.year as year
FROM
    public."RECRUITMENT_ROUND" rr
JOIN
    public."STUDENT_TEAM" st ON rr.student_team_id = st.id;