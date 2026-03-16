do $$
begin
  create type public.research_source_type as enum (
    'official',
    'property_portal',
    'mapping',
    'publisher',
    'school',
    'other'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.research_sources (
  id uuid primary key default gen_random_uuid(),
  url text not null unique,
  title text not null,
  publisher text,
  source_type public.research_source_type not null default 'other',
  date_published date,
  date_accessed date not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.suburb_profiles (
  suburb_id uuid primary key references public.suburbs(id) on delete cascade,
  access_date date not null,
  short_summary text,
  standout_feature text,
  standout_source_id uuid references public.research_sources(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.suburb_features (
  id uuid primary key default gen_random_uuid(),
  suburb_id uuid not null references public.suburbs(id) on delete cascade,
  feature_type text not null,
  fact text not null,
  source_id uuid references public.research_sources(id) on delete set null,
  access_date date not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint suburb_features_unique unique (suburb_id, feature_type, fact)
);

create table if not exists public.housing_listing_samples (
  id uuid primary key default gen_random_uuid(),
  suburb_id uuid not null references public.suburbs(id) on delete cascade,
  source_id uuid references public.research_sources(id) on delete set null,
  access_date date not null,
  property_type public.property_type not null,
  bedrooms smallint not null check (bedrooms between 0 and 8),
  parking_spaces smallint check (parking_spaces is null or parking_spaces between 0 and 6),
  monthly_rent_zar numeric(12,2) not null check (monthly_rent_zar >= 0),
  listing_title text not null,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint housing_listing_samples_unique unique (suburb_id, source_id, listing_title)
);

create index if not exists idx_research_sources_source_type on public.research_sources (source_type);
create index if not exists idx_suburb_features_suburb_id on public.suburb_features (suburb_id);
create index if not exists idx_housing_listing_samples_suburb_id on public.housing_listing_samples (suburb_id);
create index if not exists idx_housing_listing_samples_property on public.housing_listing_samples (suburb_id, property_type, bedrooms);

drop trigger if exists set_research_sources_updated_at on public.research_sources;
create trigger set_research_sources_updated_at
before update on public.research_sources
for each row
execute function public.set_updated_at();

drop trigger if exists set_suburb_profiles_updated_at on public.suburb_profiles;
create trigger set_suburb_profiles_updated_at
before update on public.suburb_profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_suburb_features_updated_at on public.suburb_features;
create trigger set_suburb_features_updated_at
before update on public.suburb_features
for each row
execute function public.set_updated_at();

drop trigger if exists set_housing_listing_samples_updated_at on public.housing_listing_samples;
create trigger set_housing_listing_samples_updated_at
before update on public.housing_listing_samples
for each row
execute function public.set_updated_at();

alter table public.research_sources enable row level security;
alter table public.suburb_profiles enable row level security;
alter table public.suburb_features enable row level security;
alter table public.housing_listing_samples enable row level security;

drop policy if exists "research sources are readable" on public.research_sources;
create policy "research sources are readable"
on public.research_sources
for select
to anon, authenticated
using (true);

drop policy if exists "suburb profiles are readable" on public.suburb_profiles;
create policy "suburb profiles are readable"
on public.suburb_profiles
for select
to anon, authenticated
using (true);

drop policy if exists "suburb features are readable" on public.suburb_features;
create policy "suburb features are readable"
on public.suburb_features
for select
to anon, authenticated
using (true);

drop policy if exists "housing listing samples are readable" on public.housing_listing_samples;
create policy "housing listing samples are readable"
on public.housing_listing_samples
for select
to anon, authenticated
using (true);
