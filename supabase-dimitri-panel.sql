-- Dimitri panel kurulumu
-- Bu dosyayı Supabase SQL Editor içinde çalıştırmadan önce
-- SENIN-ADMIN-MAILIN@example.com değerini kendi yönetici e-postanla değiştir.

create extension if not exists pgcrypto;

create table if not exists public.visitor_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  page_path text,
  page_url text,
  page_title text,
  referrer text,
  source_label text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  language text,
  platform text,
  user_agent text,
  timezone text,
  screen_width integer,
  screen_height integer,
  viewport_width integer,
  viewport_height integer,
  cookies_enabled boolean,
  cookie_snapshot text
);

create table if not exists public.numerology_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id text,
  full_name text not null,
  birthdate date not null,
  life_path_number integer not null,
  page_path text,
  page_url text,
  page_title text,
  referrer text,
  source_label text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  language text,
  platform text,
  user_agent text,
  timezone text,
  screen_width integer,
  screen_height integer,
  viewport_width integer,
  viewport_height integer,
  cookies_enabled boolean,
  cookie_snapshot text
);

create index if not exists visitor_events_created_at_idx on public.visitor_events (created_at desc);
create index if not exists visitor_events_source_label_idx on public.visitor_events (source_label);
create index if not exists numerology_leads_created_at_idx on public.numerology_leads (created_at desc);
create index if not exists numerology_leads_life_path_number_idx on public.numerology_leads (life_path_number);

alter table public.visitor_events enable row level security;
alter table public.numerology_leads enable row level security;

drop policy if exists "public insert visitor events" on public.visitor_events;
create policy "public insert visitor events"
on public.visitor_events
for insert
to anon
with check (true);

drop policy if exists "public insert numerology leads" on public.numerology_leads;
create policy "public insert numerology leads"
on public.numerology_leads
for insert
to anon
with check (true);

drop policy if exists "admin read visitor events" on public.visitor_events;
create policy "admin read visitor events"
on public.visitor_events
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'SENIN-ADMIN-MAILIN@example.com');

drop policy if exists "admin read numerology leads" on public.numerology_leads;
create policy "admin read numerology leads"
on public.numerology_leads
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'SENIN-ADMIN-MAILIN@example.com');
