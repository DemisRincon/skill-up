-- Step 1: Add the columns as nullable
ALTER TABLE public.surveys
ADD COLUMN team_member_email text,
ADD COLUMN responded boolean NOT NULL DEFAULT false;

-- Step 2: Delete old surveys with no team_member_email (if you don't need them)
DELETE FROM public.surveys WHERE team_member_email IS NULL;

-- Step 3: Set the column to NOT NULL
ALTER TABLE public.surveys
ALTER COLUMN team_member_email SET NOT NULL; 