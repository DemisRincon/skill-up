-- Enable RLS on survey_responses
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

-- Drop any existing insert policies
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON public.survey_responses;
DROP POLICY IF EXISTS "Allow invitee to insert response" ON public.survey_responses;
DROP POLICY IF EXISTS "Debug insert" ON public.survey_responses;

-- Create correct policy: only the invitee can insert
CREATE POLICY "Allow invitee to insert response"
  ON public.survey_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.survey_invites
      WHERE
        survey_invites.id = invite_id
        AND survey_invites.team_member_email = auth.email()
    )
  ); 