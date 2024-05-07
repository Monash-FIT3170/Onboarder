create table
  public."USER" (
    id bigint generated by default as identity,
    email character varying not null,
    role character varying not null,
    student_team_id bigint not null,
    name character varying null,
    constraint USER_pkey primary key (id, email),
    constraint USER_id_fkey foreign key (id) references "STUDENT_TEAM" (id)
  ) tablespace pg_default;

create table
  public."STUDENT_TEAM" (
    id bigint generated by default as identity,
    name character varying not null,
    constraint STUDENT_TEAM_pkey primary key (id),
    constraint STUDENT_TEAM_name_key unique (name)
  ) tablespace pg_default;

create table
  public."RECRUITMENT_ROUND" (
    id bigint generated by default as identity,
    semester character varying not null,
    year date not null,
    student_team_id bigint not null,
    status character varying not null,
    constraint RECRUITMENT_ROUND_pkey primary key (id, semester, year, student_team_id),
    constraint RECRUITMENT_ROUND_id_key unique (id),
    constraint RECRUITMENT_ROUND_student_team_id_fkey foreign key (student_team_id) references "STUDENT_TEAM" (id)
  ) tablespace pg_default;