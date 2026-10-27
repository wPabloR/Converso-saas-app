-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
-- Requires Clerk ↔ Supabase third-party auth (see README).

create extension if not exists "pgcrypto";

create table if not exists public.companions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  topic text not null,
  voice text not null,
  style text not null,
  duration integer not null,
  author text,
  created_at timestamptz not null default now()
);

create table if not exists public.session_history (
  id uuid primary key default gen_random_uuid(),
  companion_id uuid not null references public.companions (id) on delete cascade,
  user_id text not null,
  created_at timestamptz not null default now()
);

alter table public.companions enable row level security;
alter table public.session_history enable row level security;

-- Anyone can browse companions (library + home)
create policy "companions_select_all"
  on public.companions for select
  using (true);

-- Signed-in users create companions (author must match Clerk user id)
create policy "companions_insert_own"
  on public.companions for insert
  to authenticated
  with check ((auth.jwt() ->> 'sub') = author);

-- Session history readable by everyone (recent sessions on home)
create policy "session_history_select_all"
  on public.session_history for select
  using (true);

-- Users record their own sessions
create policy "session_history_insert_own"
  on public.session_history for insert
  to authenticated
  with check ((auth.jwt() ->> 'sub') = user_id);
