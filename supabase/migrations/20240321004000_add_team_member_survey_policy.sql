-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Managers can view their surveys" ON public.surveys;

-- Add policy to allow managers to view their own surveys
CREATE POLICY "Managers can view their surveys"
  ON public.surveys
  FOR SELECT
  USING (
    manager_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM profiles p 
      JOIN roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'manager'
    )
  );

-- Add policy to allow team members to view their own surveys
CREATE POLICY "Team members can view their own surveys"
  ON public.surveys
  FOR SELECT
  USING (
    team_member_email = auth.email()
  ); 