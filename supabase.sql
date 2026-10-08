-- Run this once in Supabase > SQL Editor

create table if not exists public.contact_messages (
  id          bigint generated always as identity primary key,
  name        text        not null,
  email       text        not null,
  phone       text,
  subject     text        not null,
  message     text        not null,
  created_at  timestamptz not null default now()
);

-- Lock the table: only the server (secret key) can write to it.
alter table public.contact_messages enable row level security;
