create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

do $$
begin
  create type public.school_type as enum ('public', 'private_low_fee', 'private_mid_tier', 'private_premium');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  is_target_region boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.suburbs (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions(id) on delete cascade,
  name text not null,
  slug text not null unique,
  median_budget_band text,
  pitch text,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  is_target_suburb boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  suburb_id uuid not null references public.suburbs(id) on delete cascade,
  name text not null,
  slug text not null unique,
  school_type public.school_type not null,
  grades_from text not null,
  grades_to text not null,
  annual_fee_min numeric(12,2) not null,
  annual_fee_max numeric(12,2) not null,
  monthly_estimate numeric(12,2) not null,
  registration_fee numeric(12,2) not null default 0,
  deposit_fee numeric(12,2) not null default 0,
  aftercare_available boolean not null default false,
  transport_available boolean not null default false,
  swimming_available boolean not null default false,
  sports text[] not null default '{}',
  facilities text[] not null default '{}',
  must_have_features text[] not null default '{}',
  nice_to_have_features text[] not null default '{}',
  curriculum text not null,
  religious_affiliation text,
  class_size_estimate integer not null,
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  distance_from_suburb_center_km numeric(8,2) not null,
  review_score numeric(3,2) not null default 4.00,
  review_count integer not null default 0,
  confidence_level text not null default 'simulated' check (confidence_level in ('simulated')),
  is_simulated boolean not null default true,
  is_active boolean not null default true,
  updated_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.school_reviews (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  reviewer_alias text not null,
  overall_score numeric(3,2) not null,
  headline text not null,
  body text not null,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  grade_relevant_to_review text not null,
  dimension_scores jsonb not null default '{}'::jsonb,
  is_simulated boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.match_sessions (
  id uuid primary key default gen_random_uuid(),
  region_slug text not null default 'midrand',
  submitted_filters jsonb not null,
  result_count integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_suburbs_region on public.suburbs (region_id);
create index if not exists idx_schools_suburb on public.schools (suburb_id);
create index if not exists idx_schools_active on public.schools (is_active);
create index if not exists idx_school_reviews_school on public.school_reviews (school_id, created_at desc);
create index if not exists idx_match_sessions_created on public.match_sessions (created_at desc);

drop trigger if exists set_regions_updated_at on public.regions;
create trigger set_regions_updated_at
before update on public.regions
for each row
execute function public.set_updated_at();

drop trigger if exists set_suburbs_updated_at on public.suburbs;
create trigger set_suburbs_updated_at
before update on public.suburbs
for each row
execute function public.set_updated_at();

drop trigger if exists set_schools_updated_at on public.schools;
create trigger set_schools_updated_at
before update on public.schools
for each row
execute function public.set_updated_at();

alter table public.regions enable row level security;
alter table public.suburbs enable row level security;
alter table public.schools enable row level security;
alter table public.school_reviews enable row level security;
alter table public.match_sessions enable row level security;

drop policy if exists "regions readable" on public.regions;
create policy "regions readable"
on public.regions
for select
to anon, authenticated
using (true);

drop policy if exists "suburbs readable" on public.suburbs;
create policy "suburbs readable"
on public.suburbs
for select
to anon, authenticated
using (true);

drop policy if exists "schools readable" on public.schools;
create policy "schools readable"
on public.schools
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "school reviews readable" on public.school_reviews;
create policy "school reviews readable"
on public.school_reviews
for select
to anon, authenticated
using (true);

comment on table public.match_sessions is 'Write through trusted routes only; no anon insert policy in MVP.';

