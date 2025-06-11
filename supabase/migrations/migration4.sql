  -- Allow all users to read all profiles (for development/testing)
  CREATE POLICY "Allow read for all"
    ON profiles
    FOR SELECT
    USING (true);


ALTER TABLE surveys
ADD COLUMN IF NOT EXISTS title text NOT NULL DEFAULT '';

create policy "Allow insert for managers"
on surveys
for insert
with check (
  exists (
    select 1 from profiles
    where id = auth.uid() and role_id = 1
  )
);

create policy "Allow insert for authenticated users"
on survey_invites
for insert
with check (auth.uid() IS NOT NULL);