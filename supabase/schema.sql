-- Run this in the Supabase SQL editor for your project.

create extension if not exists "uuid-ossp";

-- Profiles (1:1 with auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text not null,
  age int,
  gender text,
  height_cm numeric,
  weight_kg numeric,
  goal text,
  activity_level text,
  days_per_week int,
  theme text default 'soft-pink',
  onboarding_complete boolean default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Workout plans (days stored as jsonb array matching WorkoutDay[])
create table if not exists workout_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  week_start timestamptz default now(),
  bmi numeric,
  goal text,
  difficulty text,
  days jsonb not null,
  created_at timestamptz default now()
);

alter table workout_plans enable row level security;
create policy "Users manage own plans" on workout_plans for all using (auth.uid() = user_id);

-- Workout completion logs
create table if not exists workout_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  plan_id uuid references workout_plans(id) on delete cascade,
  day text not null,
  completed_at timestamptz default now()
);

alter table workout_logs enable row level security;
create policy "Users manage own workout logs" on workout_logs for all using (auth.uid() = user_id);

-- Weight logs
create table if not exists weight_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  weight_kg numeric not null,
  logged_at timestamptz default now()
);

alter table weight_logs enable row level security;
create policy "Users manage own weight logs" on weight_logs for all using (auth.uid() = user_id);

-- Chat messages
create table if not exists chat_messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;
create policy "Users manage own chat messages" on chat_messages for all using (auth.uid() = user_id);

-- Spotify tokens (server-only access via service role key)
create table if not exists spotify_tokens (
  user_id uuid primary key references profiles(id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at bigint not null
);

alter table spotify_tokens enable row level security;
-- No public policies: only accessed via the service role key on the server.

-- Reminders
create table if not exists reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  message text not null,
  remind_at timestamptz not null,
  created_at timestamptz default now()
);

alter table reminders enable row level security;
create policy "Users manage own reminders" on reminders for all using (auth.uid() = user_id);
