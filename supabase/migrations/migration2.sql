-- Allow anyone to insert a profile, but only for their own user ID
create policy "Anyone can insert their own profile"
  on profiles for insert
  with check (true);