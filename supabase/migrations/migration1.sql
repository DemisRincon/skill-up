-- Enable UUID extension if not already enabled
create extension if not exists "pgcrypto";

-- Drop tables if they exist (in dependency order)
drop table if exists survey_responses cascade;
drop table if exists survey_invites cascade;
drop table if exists surveys cascade;
drop table if exists profiles cascade;
drop table if exists roles cascade;

-- Roles table (optional, for extensibility)
create table roles (
  id serial primary key,
  name text unique not null check (name in ('manager', 'team_member'))
);
insert into roles (name) values ('manager'), ('team_member') on conflict do nothing;

-- Profiles table (linked to auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id integer references roles(id) not null,
  full_name text
);

-- Surveys table
create table surveys (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Survey Invites table
create table survey_invites (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references surveys(id) on delete cascade,
  team_member_name text not null,
  team_member_email text not null,
  invite_token text unique not null,
  responded boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Survey Responses table
create table survey_responses (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references survey_invites(id) on delete cascade,
  q1 integer check (q1 between 1 and 5),
  q2 integer check (q2 between 1 and 5),
  q3 integer check (q3 between 1 and 5),
  submitted_at timestamp with time zone default timezone('utc', now())
);

-- Enable RLS
alter table profiles enable row level security;
alter table surveys enable row level security;
alter table survey_invites enable row level security;
alter table survey_responses enable row level security;

-- RLS Policies for profiles
-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);
-- Allow users to select their own profile
create policy "Users can select their own profile"
  on profiles for select
  using (auth.uid() = id);
-- Allow users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
-- Allow users to delete their own profile
create policy "Users can delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

-- RLS Policies for surveys
-- Only managers can create surveys
create policy "Only managers can create surveys"
  on surveys for insert
  with check (
    manager_id = auth.uid() AND
    exists (
      select 1 from profiles p join roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'manager'
    )
  );
-- Only managers can view their own surveys
create policy "Managers can view their surveys"
  on surveys for select
  using (
    manager_id = auth.uid() AND
    exists (
      select 1 from profiles p join roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'manager'
    )
  );

-- RLS Policies for survey_invites
-- Only managers can view their own invites
create policy "Managers can view their invites"
  on survey_invites for select
  using (
    survey_id in (select id from surveys where manager_id = auth.uid())
  );

-- RLS Policies for survey_responses
-- Only allow inserting responses if the invite_token matches
create policy "Team member can submit response"
  on survey_responses for insert
  with check (
    invite_id in (
      select id from survey_invites
      where invite_token = current_setting('request.jwt.claim.invite_token', true)
    )
  );

-- Indexes for performance
create index if not exists idx_surveys_manager_id on surveys(manager_id);
create index if not exists idx_invites_survey_id on survey_invites(survey_id);
create index if not exists idx_responses_invite_id on survey_responses(invite_id);-- Enable UUID extension if not already enabled
create extension if not exists "pgcrypto";

-- Drop tables if they exist (in dependency order)
drop table if exists survey_responses cascade;
drop table if exists survey_invites cascade;
drop table if exists surveys cascade;
drop table if exists profiles cascade;
drop table if exists roles cascade;

-- Roles table (optional, for extensibility)
create table roles (
  id serial primary key,
  name text unique not null check (name in ('manager', 'team_member'))
);
insert into roles (name) values ('manager'), ('team_member') on conflict do nothing;

-- Profiles table (linked to auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id integer references roles(id) not null,
  full_name text
);

-- Surveys table
create table surveys (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Survey Invites table
create table survey_invites (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid references surveys(id) on delete cascade,
  team_member_name text not null,
  team_member_email text not null,
  invite_token text unique not null,
  responded boolean default false,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Survey Responses table
create table survey_responses (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid references survey_invites(id) on delete cascade,
  q1 integer check (q1 between 1 and 5),
  q2 integer check (q2 between 1 and 5),
  q3 integer check (q3 between 1 and 5),
  submitted_at timestamp with time zone default timezone('utc', now())
);

-- Enable RLS
alter table profiles enable row level security;
alter table surveys enable row level security;
alter table survey_invites enable row level security;
alter table survey_responses enable row level security;

-- RLS Policies for profiles
-- Allow users to insert their own profile
create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);
-- Allow users to select their own profile
create policy "Users can select their own profile"
  on profiles for select
  using (auth.uid() = id);
-- Allow users to update their own profile
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
-- Allow users to delete their own profile
create policy "Users can delete their own profile"
  on profiles for delete
  using (auth.uid() = id);

-- RLS Policies for surveys
-- Only managers can create surveys
create policy "Only managers can create surveys"
  on surveys for insert
  with check (
    manager_id = auth.uid() AND
    exists (
      select 1 from profiles p join roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'manager'
    )
  );
-- Only managers can view their own surveys
create policy "Managers can view their surveys"
  on surveys for select
  using (
    manager_id = auth.uid() AND
    exists (
      select 1 from profiles p join roles r on p.role_id = r.id
      where p.id = auth.uid() and r.name = 'manager'
    )
  );

-- RLS Policies for survey_invites
-- Only managers can view their own invites
create policy "Managers can view their invites"
  on survey_invites for select
  using (
    survey_id in (select id from surveys where manager_id = auth.uid())
  );

-- RLS Policies for survey_responses
-- Only allow inserting responses if the invite_token matches
create policy "Team member can submit response"
  on survey_responses for insert
  with check (
    invite_id in (
      select id from survey_invites
      where invite_token = current_setting('request.jwt.claim.invite_token', true)
    )
  );

-- Indexes for performance
create index if not exists idx_surveys_manager_id on surveys(manager_id);
create index if not exists idx_invites_survey_id on survey_invites(survey_id);
create index if not exists idx_responses_invite_id on survey_responses(invite_id);

