-- To keep track of the status of the calendar invites
ALTER TABLE public."OPENING"
ADD COLUMN calendar_invites_sent BOOLEAN DEFAULT FALSE;