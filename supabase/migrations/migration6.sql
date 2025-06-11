-- Create table for dynamic survey answers
CREATE TABLE public.survey_response_answers (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    response_id uuid NOT NULL,
    question_index integer NOT NULL,
    answer integer NOT NULL CHECK (answer >= 1 AND answer <= 5),
    CONSTRAINT survey_response_answers_pkey PRIMARY KEY (id),
    CONSTRAINT survey_response_answers_response_id_fkey FOREIGN KEY (response_id) REFERENCES public.survey_responses(id) ON DELETE CASCADE
); 
-- Enable RLS if not already enabled
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow invitee to insert response"
  ON public.survey_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.survey_invites
      WHERE
        survey_invites.id = survey_responses.invite_id
        AND survey_invites.team_member_email = auth.email()
    )
  );