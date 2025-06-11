-- Add team_member_email and responded columns to surveys
ALTER TABLE public.surveys
ADD COLUMN team_member_email text NOT NULL,
ADD COLUMN responded boolean NOT NULL DEFAULT false;

-- Optionally drop old tables if fully migrating
DROP TABLE IF EXISTS public.survey_invites CASCADE;
DROP TABLE IF EXISTS public.survey_responses CASCADE;
DROP TABLE IF EXISTS public.survey_response_answers CASCADE; 