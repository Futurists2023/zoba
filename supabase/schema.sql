create extension if not exists pgcrypto;

do $$
begin
  create type public.confidence_level as enum ('low', 'medium', 'high');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.housing_mode as enum ('rent', 'buy');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.property_type as enum ('apartment', 'townhouse', 'house', 'any');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.life_stage as enum ('solo', 'couple', 'family', 'shared_household');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.employment_setup as enum ('office', 'hybrid', 'remote', 'mixed');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.lifestyle_tier as enum ('value', 'balanced', 'comfortable');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.school_type as enum ('none', 'public', 'private_mid', 'private_premium');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.childcare_type as enum ('none', 'part_time', 'full_time');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.domestic_help_frequency as enum ('none', 'monthly', 'weekly', 'twice_weekly', 'full_time');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.medical_aid_tier as enum ('none', 'basic', 'mid', 'premium');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.fibre_tier as enum ('none', 'basic', 'standard', 'fast');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.mobile_tier as enum ('basic', 'standard', 'heavy');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.backup_power_tier as enum ('none', 'basic', 'inverter', 'full');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.page_type as enum ('suburb', 'comparison', 'audience', 'audience_suburb');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.affordability_band as enum ('stretched', 'workable', 'comfortable');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.work_destination_area as enum (
    'remote',
    'cbd',
    'century_city',
    'claremont',
    'bellville',
    'airport_industria',
    'somerset_west'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.cost_band_category as enum (
    'grocery',
    'medical_aid',
    'fibre',
    'mobile',
    'school',
    'childcare',
    'domestic_help',
    'backup_power',
    'utilities'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.unit_kind as enum (
    'monthly_household',
    'monthly_adult',
    'monthly_child',
    'monthly_line_item'
  );
exception
  when duplicate_object then null;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.suburbs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  city text not null default 'Cape Town',
  region_group text not null,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint suburbs_slug_unique unique (city, slug)
);

create table if not exists public.pricing_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  version_label text not null unique,
  notes text,
  is_live boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.housing_costs (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references public.pricing_snapshots(id) on delete cascade,
  suburb_id uuid not null references public.suburbs(id) on delete cascade,
  housing_mode public.housing_mode not null default 'rent',
  property_type public.property_type not null,
  bedrooms smallint not null check (bedrooms between 0 and 8),
  parking_spaces smallint not null default 0 check (parking_spaces between 0 and 6),
  low_value numeric(12,2) not null check (low_value >= 0),
  mid_value numeric(12,2) not null check (mid_value >= low_value),
  high_value numeric(12,2) not null check (high_value >= mid_value),
  confidence public.confidence_level not null default 'medium',
  source_count integer not null default 1 check (source_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint housing_costs_unique unique (
    snapshot_id,
    suburb_id,
    housing_mode,
    property_type,
    bedrooms,
    parking_spaces
  )
);

create table if not exists public.transport_costs (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references public.pricing_snapshots(id) on delete cascade,
  suburb_id uuid not null references public.suburbs(id) on delete cascade,
  work_destination_area public.work_destination_area not null,
  round_trip_km numeric(8,2) not null check (round_trip_km >= 0),
  per_km_rate numeric(8,2) not null check (per_km_rate >= 0),
  car_fixed_band numeric(12,2) not null check (car_fixed_band >= 0),
  public_transport_band numeric(12,2) not null check (public_transport_band >= 0),
  uber_trip_band numeric(12,2) not null check (uber_trip_band >= 0),
  confidence public.confidence_level not null default 'medium',
  source_count integer not null default 1 check (source_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint transport_costs_unique unique (snapshot_id, suburb_id, work_destination_area)
);

create table if not exists public.cost_bands (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references public.pricing_snapshots(id) on delete cascade,
  category public.cost_band_category not null,
  segment_key text not null,
  subsegment_key text,
  adult_count smallint check (adult_count is null or adult_count between 0 and 8),
  child_count smallint check (child_count is null or child_count between 0 and 8),
  unit_kind public.unit_kind not null default 'monthly_household',
  low_value numeric(12,2) not null check (low_value >= 0),
  mid_value numeric(12,2) not null check (mid_value >= low_value),
  high_value numeric(12,2) not null check (high_value >= mid_value),
  confidence public.confidence_level not null default 'medium',
  source_count integer not null default 1 check (source_count >= 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.scenario_inputs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  email text,
  adults smallint not null check (adults between 1 and 8),
  children smallint not null default 0 check (children between 0 and 8),
  life_stage public.life_stage not null,
  employment_setup public.employment_setup not null,
  lifestyle_tier public.lifestyle_tier not null,
  housing_mode public.housing_mode not null default 'rent',
  bedrooms smallint not null check (bedrooms between 0 and 8),
  parking_spaces smallint not null default 0 check (parking_spaces between 0 and 6),
  property_type public.property_type not null default 'any',
  net_monthly_income numeric(12,2),
  work_destination_area public.work_destination_area not null default 'remote',
  cars smallint not null default 0 check (cars between 0 and 6),
  commute_days_per_week smallint not null default 0 check (commute_days_per_week between 0 and 7),
  uses_uber boolean not null default false,
  uber_trips_per_month smallint not null default 0 check (uber_trips_per_month between 0 and 100),
  uses_public_transport boolean not null default false,
  school_type public.school_type not null default 'none',
  childcare public.childcare_type not null default 'none',
  domestic_help public.domestic_help_frequency not null default 'none',
  medical_aid_tier public.medical_aid_tier not null default 'none',
  fibre_tier public.fibre_tier not null default 'none',
  mobile_tier public.mobile_tier not null default 'basic',
  backup_power public.backup_power_tier not null default 'none',
  selected_suburb_ids uuid[] not null,
  housing_override numeric(12,2),
  input_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint selected_suburb_count check (cardinality(selected_suburb_ids) between 1 and 3)
);

create table if not exists public.scenario_results (
  id uuid primary key default gen_random_uuid(),
  scenario_input_id uuid not null references public.scenario_inputs(id) on delete cascade,
  snapshot_id uuid not null references public.pricing_snapshots(id) on delete restrict,
  primary_suburb_id uuid not null references public.suburbs(id) on delete restrict,
  formula_version text not null,
  affordability public.affordability_band,
  monthly_low numeric(12,2) not null check (monthly_low >= 0),
  monthly_mid numeric(12,2) not null check (monthly_mid >= monthly_low),
  monthly_high numeric(12,2) not null check (monthly_high >= monthly_mid),
  workable_net_salary numeric(12,2),
  comfortable_net_salary numeric(12,2),
  result_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.seo_page_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_id uuid not null references public.pricing_snapshots(id) on delete cascade,
  page_type public.page_type not null,
  slug text not null,
  entity_keys jsonb not null default '{}'::jsonb,
  summary_json jsonb not null default '{}'::jsonb,
  uniqueness_score numeric(5,4) not null check (uniqueness_score between 0 and 1),
  published_at timestamptz,
  is_indexable boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint seo_page_snapshots_unique unique (snapshot_id, page_type, slug)
);

create index if not exists idx_suburbs_active on public.suburbs (is_active);
create index if not exists idx_pricing_snapshots_live on public.pricing_snapshots (is_live) where is_live = true;
create index if not exists idx_housing_costs_lookup on public.housing_costs (snapshot_id, suburb_id, housing_mode, property_type, bedrooms);
create index if not exists idx_transport_costs_lookup on public.transport_costs (snapshot_id, suburb_id, work_destination_area);
create index if not exists idx_cost_bands_lookup on public.cost_bands (snapshot_id, category, segment_key, subsegment_key);
create index if not exists idx_scenario_inputs_created_at on public.scenario_inputs (created_at desc);
create index if not exists idx_scenario_results_created_at on public.scenario_results (created_at desc);
create index if not exists idx_scenario_results_primary_suburb on public.scenario_results (primary_suburb_id, created_at desc);
create index if not exists idx_seo_page_snapshots_indexable on public.seo_page_snapshots (is_indexable, page_type);

drop trigger if exists set_suburbs_updated_at on public.suburbs;
create trigger set_suburbs_updated_at
before update on public.suburbs
for each row
execute function public.set_updated_at();

drop trigger if exists set_pricing_snapshots_updated_at on public.pricing_snapshots;
create trigger set_pricing_snapshots_updated_at
before update on public.pricing_snapshots
for each row
execute function public.set_updated_at();

drop trigger if exists set_housing_costs_updated_at on public.housing_costs;
create trigger set_housing_costs_updated_at
before update on public.housing_costs
for each row
execute function public.set_updated_at();

drop trigger if exists set_transport_costs_updated_at on public.transport_costs;
create trigger set_transport_costs_updated_at
before update on public.transport_costs
for each row
execute function public.set_updated_at();

drop trigger if exists set_cost_bands_updated_at on public.cost_bands;
create trigger set_cost_bands_updated_at
before update on public.cost_bands
for each row
execute function public.set_updated_at();

drop trigger if exists set_scenario_inputs_updated_at on public.scenario_inputs;
create trigger set_scenario_inputs_updated_at
before update on public.scenario_inputs
for each row
execute function public.set_updated_at();

drop trigger if exists set_seo_page_snapshots_updated_at on public.seo_page_snapshots;
create trigger set_seo_page_snapshots_updated_at
before update on public.seo_page_snapshots
for each row
execute function public.set_updated_at();

alter table public.suburbs enable row level security;
alter table public.pricing_snapshots enable row level security;
alter table public.housing_costs enable row level security;
alter table public.transport_costs enable row level security;
alter table public.cost_bands enable row level security;
alter table public.scenario_inputs enable row level security;
alter table public.scenario_results enable row level security;
alter table public.seo_page_snapshots enable row level security;

drop policy if exists "reference data is readable" on public.suburbs;
create policy "reference data is readable"
on public.suburbs
for select
to anon, authenticated
using (true);

drop policy if exists "pricing snapshots are readable" on public.pricing_snapshots;
create policy "pricing snapshots are readable"
on public.pricing_snapshots
for select
to anon, authenticated
using (true);

drop policy if exists "housing costs are readable" on public.housing_costs;
create policy "housing costs are readable"
on public.housing_costs
for select
to anon, authenticated
using (true);

drop policy if exists "transport costs are readable" on public.transport_costs;
create policy "transport costs are readable"
on public.transport_costs
for select
to anon, authenticated
using (true);

drop policy if exists "cost bands are readable" on public.cost_bands;
create policy "cost bands are readable"
on public.cost_bands
for select
to anon, authenticated
using (true);

drop policy if exists "indexable seo pages are readable" on public.seo_page_snapshots;
create policy "indexable seo pages are readable"
on public.seo_page_snapshots
for select
to anon, authenticated
using (is_indexable = true);

comment on table public.scenario_inputs is 'Write through a trusted API route or service role in MVP; no anon policies are granted by default.';
comment on table public.scenario_results is 'Write through a trusted API route or service role in MVP; no anon policies are granted by default.';

create or replace view public.live_reference_snapshot as
select
  ps.id,
  ps.snapshot_date,
  ps.version_label,
  ps.notes
from public.pricing_snapshots ps
where ps.is_live = true
order by ps.snapshot_date desc
limit 1;

create or replace view public.live_indexable_seo_pages as
select
  sps.id,
  sps.page_type,
  sps.slug,
  sps.entity_keys,
  sps.summary_json,
  sps.uniqueness_score,
  sps.published_at,
  ps.snapshot_date,
  ps.version_label
from public.seo_page_snapshots sps
join public.pricing_snapshots ps on ps.id = sps.snapshot_id
where sps.is_indexable = true
  and ps.is_live = true;

create or replace function public.get_live_snapshot_id()
returns uuid
language sql
stable
as $$
  select ps.id
  from public.pricing_snapshots ps
  where ps.is_live = true
  order by ps.snapshot_date desc, ps.created_at desc
  limit 1;
$$;

create or replace function public.pick_modeled_value(
  p_low numeric,
  p_mid numeric,
  p_high numeric,
  p_lifestyle_tier public.lifestyle_tier
)
returns numeric
language sql
immutable
as $$
  select case p_lifestyle_tier
    when 'value' then round(coalesce(p_low, 0), 2)
    when 'balanced' then round(coalesce(p_mid, coalesce(p_low, 0)), 2)
    when 'comfortable' then round((coalesce(p_mid, 0) + coalesce(p_high, coalesce(p_mid, 0))) / 2.0, 2)
  end;
$$;

create or replace function public.confidence_rank(p_confidence public.confidence_level)
returns integer
language sql
immutable
as $$
  select case p_confidence
    when 'low' then 1
    when 'medium' then 2
    when 'high' then 3
  end;
$$;

create or replace function public.calculate_affordability_band(
  p_net_monthly_income numeric,
  p_workable_net_salary numeric,
  p_comfortable_net_salary numeric
)
returns public.affordability_band
language sql
immutable
as $$
  select case
    when p_net_monthly_income is null then null
    when p_net_monthly_income < p_workable_net_salary then 'stretched'::public.affordability_band
    when p_net_monthly_income < p_comfortable_net_salary then 'workable'::public.affordability_band
    else 'comfortable'::public.affordability_band
  end;
$$;

create or replace function public.resolve_cost_band(
  p_category public.cost_band_category,
  p_segment_key text,
  p_subsegment_key text default null,
  p_adult_count smallint default null,
  p_child_count smallint default null,
  p_lifestyle_tier public.lifestyle_tier default 'balanced',
  p_snapshot_id uuid default null
)
returns table (
  snapshot_id uuid,
  category public.cost_band_category,
  segment_key text,
  subsegment_key text,
  adult_count smallint,
  child_count smallint,
  unit_kind public.unit_kind,
  low_value numeric,
  mid_value numeric,
  high_value numeric,
  selected_value numeric,
  confidence public.confidence_level,
  metadata jsonb
)
language plpgsql
stable
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
begin
  return query
  with candidates as (
    select
      cb.*,
      case
        when p_adult_count is null and cb.adult_count is null then 0
        when p_adult_count is not null and cb.adult_count = p_adult_count then 0
        when cb.adult_count is null then 1
        else 2
      end as adult_rank,
      case
        when p_adult_count is null then 0
        when cb.adult_count is null then 0
        else abs(cb.adult_count - p_adult_count)
      end as adult_distance,
      case
        when p_child_count is null and cb.child_count is null then 0
        when p_child_count is not null and cb.child_count = p_child_count then 0
        when cb.child_count is null then 1
        else 2
      end as child_rank,
      case
        when p_child_count is null then 0
        when cb.child_count is null then 0
        else abs(cb.child_count - p_child_count)
      end as child_distance
    from public.cost_bands cb
    where cb.snapshot_id = v_snapshot_id
      and cb.category = p_category
      and cb.segment_key = p_segment_key
      and (
        (p_subsegment_key is null and cb.subsegment_key is null)
        or cb.subsegment_key = p_subsegment_key
      )
  ),
  ranked as (
    select
      c.*,
      row_number() over (
        order by
          c.adult_rank,
          c.adult_distance,
          c.child_rank,
          c.child_distance,
          c.created_at asc
      ) as rn
    from candidates c
  )
  select
    r.snapshot_id,
    r.category,
    r.segment_key,
    r.subsegment_key,
    r.adult_count,
    r.child_count,
    r.unit_kind,
    r.low_value,
    r.mid_value,
    r.high_value,
    public.pick_modeled_value(r.low_value, r.mid_value, r.high_value, p_lifestyle_tier) as selected_value,
    r.confidence,
    r.metadata
  from ranked r
  where r.rn = 1;
end;
$$;

create or replace function public.resolve_housing_estimate(
  p_suburb_id uuid,
  p_bedrooms smallint,
  p_parking_spaces smallint default 0,
  p_property_type public.property_type default 'any',
  p_lifestyle_tier public.lifestyle_tier default 'balanced',
  p_snapshot_id uuid default null,
  p_housing_override numeric default null
)
returns table (
  snapshot_id uuid,
  suburb_id uuid,
  housing_mode public.housing_mode,
  property_type public.property_type,
  bedrooms smallint,
  parking_spaces smallint,
  low_value numeric,
  mid_value numeric,
  high_value numeric,
  selected_value numeric,
  confidence public.confidence_level,
  metadata jsonb
)
language plpgsql
stable
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
begin
  if p_housing_override is not null then
    return query
    select
      v_snapshot_id,
      p_suburb_id,
      'rent'::public.housing_mode,
      p_property_type,
      p_bedrooms,
      p_parking_spaces,
      p_housing_override,
      p_housing_override,
      p_housing_override,
      p_housing_override,
      'high'::public.confidence_level,
      jsonb_build_object('override', true);
    return;
  end if;

  return query
  with candidates as (
    select
      hc.*,
      case
        when p_property_type = 'any' and hc.property_type = 'any' then 0
        when hc.property_type = p_property_type then 0
        when hc.property_type = 'any' then 1
        else 2
      end as property_rank,
      abs(hc.parking_spaces - p_parking_spaces) as parking_distance
    from public.housing_costs hc
    where hc.snapshot_id = v_snapshot_id
      and hc.suburb_id = p_suburb_id
      and hc.housing_mode = 'rent'
      and hc.bedrooms = p_bedrooms
      and (
        p_property_type = 'any'
        or hc.property_type in (p_property_type, 'any')
      )
  ),
  ranked as (
    select
      c.*,
      row_number() over (
        order by
          c.property_rank,
          c.parking_distance,
          c.source_count desc,
          c.created_at asc
      ) as rn
    from candidates c
  )
  select
    r.snapshot_id,
    r.suburb_id,
    r.housing_mode,
    r.property_type,
    r.bedrooms,
    r.parking_spaces,
    r.low_value,
    r.mid_value,
    r.high_value,
    public.pick_modeled_value(r.low_value, r.mid_value, r.high_value, p_lifestyle_tier) as selected_value,
    r.confidence,
    r.metadata
  from ranked r
  where r.rn = 1;
end;
$$;

create or replace function public.resolve_transport_estimate(
  p_suburb_id uuid,
  p_work_destination_area public.work_destination_area,
  p_cars smallint default 0,
  p_commute_days_per_week smallint default 0,
  p_uses_uber boolean default false,
  p_uber_trips_per_month smallint default 0,
  p_uses_public_transport boolean default false,
  p_lifestyle_tier public.lifestyle_tier default 'balanced',
  p_snapshot_id uuid default null
)
returns table (
  snapshot_id uuid,
  suburb_id uuid,
  work_destination_area public.work_destination_area,
  low_value numeric,
  mid_value numeric,
  high_value numeric,
  selected_value numeric,
  confidence public.confidence_level,
  car_fixed_cost numeric,
  car_variable_cost numeric,
  public_transport_cost numeric,
  uber_cost numeric,
  metadata jsonb
)
language plpgsql
stable
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
begin
  return query
  with source_row as (
    select tc.*
    from public.transport_costs tc
    where tc.snapshot_id = v_snapshot_id
      and tc.suburb_id = p_suburb_id
      and tc.work_destination_area = p_work_destination_area
    limit 1
  ),
  modeled as (
    select
      sr.snapshot_id,
      sr.suburb_id,
      sr.work_destination_area,
      round((greatest(p_cars, 0) * sr.car_fixed_band), 2) as car_fixed_cost,
      round((greatest(p_cars, 0) * sr.round_trip_km * greatest(p_commute_days_per_week, 0) * 4.3 * sr.per_km_rate), 2) as car_variable_cost,
      round((case when p_uses_public_transport then sr.public_transport_band else 0 end), 2) as public_transport_cost,
      round((case when p_uses_uber then sr.uber_trip_band * greatest(p_uber_trips_per_month, 0) else 0 end), 2) as uber_cost,
      sr.confidence,
      sr.metadata
    from source_row sr
  ),
  totals as (
    select
      m.*,
      round((m.car_fixed_cost + m.car_variable_cost + m.public_transport_cost + m.uber_cost) * 0.92, 2) as low_value,
      round((m.car_fixed_cost + m.car_variable_cost + m.public_transport_cost + m.uber_cost), 2) as mid_value,
      round((m.car_fixed_cost + m.car_variable_cost + m.public_transport_cost + m.uber_cost) * 1.08, 2) as high_value
    from modeled m
  )
  select
    t.snapshot_id,
    t.suburb_id,
    t.work_destination_area,
    t.low_value,
    t.mid_value,
    t.high_value,
    public.pick_modeled_value(t.low_value, t.mid_value, t.high_value, p_lifestyle_tier) as selected_value,
    t.confidence,
    t.car_fixed_cost,
    t.car_variable_cost,
    t.public_transport_cost,
    t.uber_cost,
    t.metadata
  from totals t;
end;
$$;

create or replace function public.calculate_salary_thresholds(
  p_base_total numeric,
  p_lifestyle_tier public.lifestyle_tier
)
returns table (
  discretionary_rate numeric,
  resilience_rate numeric,
  workable_net_salary numeric,
  comfortable_net_salary numeric
)
language sql
immutable
as $$
  with rates as (
    select
      case p_lifestyle_tier
        when 'value' then 0.05
        when 'balanced' then 0.10
        when 'comfortable' then 0.15
      end::numeric as discretionary_rate,
      case p_lifestyle_tier
        when 'value' then 0.05
        when 'balanced' then 0.08
        when 'comfortable' then 0.10
      end::numeric as resilience_rate
  )
  select
    r.discretionary_rate,
    r.resilience_rate,
    round((p_base_total + (p_base_total * r.resilience_rate)), 2) as workable_net_salary,
    round((p_base_total + (p_base_total * r.resilience_rate) + (p_base_total * r.discretionary_rate)), 2) as comfortable_net_salary
  from rates r;
$$;

create or replace function public.calculate_suburb_quote(
  p_suburb_id uuid,
  p_adults smallint,
  p_children smallint,
  p_lifestyle_tier public.lifestyle_tier,
  p_bedrooms smallint,
  p_parking_spaces smallint default 0,
  p_property_type public.property_type default 'any',
  p_housing_override numeric default null,
  p_work_destination_area public.work_destination_area default 'remote',
  p_cars smallint default 0,
  p_commute_days_per_week smallint default 0,
  p_uses_uber boolean default false,
  p_uber_trips_per_month smallint default 0,
  p_uses_public_transport boolean default false,
  p_school_type public.school_type default 'none',
  p_childcare public.childcare_type default 'none',
  p_domestic_help public.domestic_help_frequency default 'none',
  p_medical_aid_tier public.medical_aid_tier default 'none',
  p_fibre_tier public.fibre_tier default 'none',
  p_mobile_tier public.mobile_tier default 'basic',
  p_backup_power public.backup_power_tier default 'none',
  p_net_monthly_income numeric default null,
  p_snapshot_id uuid default null
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
  v_suburb public.suburbs%rowtype;
  v_housing record;
  v_transport record;
  v_grocery record;
  v_utilities record;
  v_fibre record;
  v_mobile record;
  v_school record;
  v_childcare record;
  v_domestic record;
  v_backup record;
  v_medical_adult record;
  v_medical_child record;
  v_salary record;
  v_housing_selected numeric := 0;
  v_transport_selected numeric := 0;
  v_grocery_selected numeric := 0;
  v_utilities_selected numeric := 0;
  v_fibre_selected numeric := 0;
  v_mobile_selected numeric := 0;
  v_school_selected numeric := 0;
  v_childcare_selected numeric := 0;
  v_domestic_selected numeric := 0;
  v_backup_selected numeric := 0;
  v_medical_selected numeric := 0;
  v_low_total numeric := 0;
  v_mid_total numeric := 0;
  v_high_total numeric := 0;
  v_base_total numeric := 0;
  v_affordability public.affordability_band;
  v_overall_confidence public.confidence_level;
  v_school_confidence public.confidence_level := 'high';
  v_medical_confidence public.confidence_level := 'high';
  v_drivers jsonb;
begin
  if v_snapshot_id is null then
    raise exception 'No live pricing snapshot found';
  end if;

  select *
  into v_suburb
  from public.suburbs s
  where s.id = p_suburb_id
    and s.is_active = true;

  if not found then
    raise exception 'Suburb % not found or inactive', p_suburb_id;
  end if;

  select *
  into v_housing
  from public.resolve_housing_estimate(
    p_suburb_id := p_suburb_id,
    p_bedrooms := p_bedrooms,
    p_parking_spaces := p_parking_spaces,
    p_property_type := p_property_type,
    p_lifestyle_tier := p_lifestyle_tier,
    p_snapshot_id := v_snapshot_id,
    p_housing_override := p_housing_override
  );

  if not found then
    raise exception 'No housing band found for suburb %, bedrooms %, property_type %', p_suburb_id, p_bedrooms, p_property_type;
  end if;

  select *
  into v_transport
  from public.resolve_transport_estimate(
    p_suburb_id := p_suburb_id,
    p_work_destination_area := p_work_destination_area,
    p_cars := p_cars,
    p_commute_days_per_week := p_commute_days_per_week,
    p_uses_uber := p_uses_uber,
    p_uber_trips_per_month := p_uber_trips_per_month,
    p_uses_public_transport := p_uses_public_transport,
    p_lifestyle_tier := p_lifestyle_tier,
    p_snapshot_id := v_snapshot_id
  );

  if not found then
    raise exception 'No transport band found for suburb % and work destination %', p_suburb_id, p_work_destination_area;
  end if;

  select * into v_grocery
  from public.resolve_cost_band('grocery', 'base', null, p_adults, p_children, p_lifestyle_tier, v_snapshot_id);

  select * into v_utilities
  from public.resolve_cost_band('utilities', 'base', null, p_adults, p_children, p_lifestyle_tier, v_snapshot_id);

  select * into v_fibre
  from public.resolve_cost_band('fibre', p_fibre_tier::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

  select * into v_mobile
  from public.resolve_cost_band('mobile', p_mobile_tier::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

  select * into v_domestic
  from public.resolve_cost_band('domestic_help', p_domestic_help::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

  select * into v_backup
  from public.resolve_cost_band('backup_power', p_backup_power::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

  if p_children > 0 then
    select * into v_school
    from public.resolve_cost_band('school', p_school_type::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

    select * into v_childcare
    from public.resolve_cost_band('childcare', p_childcare::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

    if v_school.snapshot_id is null or v_childcare.snapshot_id is null then
      raise exception 'One or more family cost bands are missing for snapshot %', v_snapshot_id;
    end if;

    v_school_confidence := coalesce(v_school.confidence, 'high'::public.confidence_level);
  end if;

  if p_medical_aid_tier <> 'none' then
    select * into v_medical_adult
    from public.resolve_cost_band('medical_aid', p_medical_aid_tier::text, 'adult', null, null, p_lifestyle_tier, v_snapshot_id);

    if p_children > 0 then
      select * into v_medical_child
      from public.resolve_cost_band('medical_aid', p_medical_aid_tier::text, 'child', null, null, p_lifestyle_tier, v_snapshot_id);
    end if;

    if v_medical_adult.snapshot_id is null then
      raise exception 'Medical aid adult band is missing for snapshot % and tier %', v_snapshot_id, p_medical_aid_tier;
    end if;

    if p_children > 0 and v_medical_child.snapshot_id is null then
      raise exception 'Medical aid child band is missing for snapshot % and tier %', v_snapshot_id, p_medical_aid_tier;
    end if;

    v_medical_confidence := coalesce(v_medical_adult.confidence, 'high'::public.confidence_level);
  end if;

  if v_grocery.snapshot_id is null
     or v_utilities.snapshot_id is null
     or v_fibre.snapshot_id is null
     or v_mobile.snapshot_id is null
     or v_domestic.snapshot_id is null
     or v_backup.snapshot_id is null then
    raise exception 'One or more required cost bands are missing for snapshot %', v_snapshot_id;
  end if;

  v_housing_selected := v_housing.selected_value;
  v_transport_selected := v_transport.selected_value;
  v_grocery_selected := v_grocery.selected_value;
  v_utilities_selected := v_utilities.selected_value;
  v_fibre_selected := v_fibre.selected_value;
  v_mobile_selected := round(v_mobile.selected_value * greatest(p_adults, 1), 2);
  v_domestic_selected := v_domestic.selected_value;
  v_backup_selected := v_backup.selected_value;

  if p_children > 0 and v_school.selected_value is not null then
    v_school_selected := round(v_school.selected_value * p_children, 2);
  end if;

  if p_children > 0 and v_childcare.selected_value is not null then
    v_childcare_selected := round(v_childcare.selected_value * p_children, 2);
  end if;

  if p_medical_aid_tier <> 'none' and v_medical_adult.selected_value is not null then
    v_medical_selected := round(v_medical_adult.selected_value * p_adults, 2);
    if p_children > 0 and v_medical_child.selected_value is not null then
      v_medical_selected := v_medical_selected + round(v_medical_child.selected_value * p_children, 2);
    end if;
  end if;

  v_low_total :=
    v_housing.low_value +
    v_transport.low_value +
    v_grocery.low_value +
    v_utilities.low_value +
    v_fibre.low_value +
    (v_mobile.low_value * greatest(p_adults, 1)) +
    coalesce(v_school.low_value, 0) * greatest(p_children, 0) +
    coalesce(v_childcare.low_value, 0) * greatest(p_children, 0) +
    v_domestic.low_value +
    v_backup.low_value +
    (coalesce(v_medical_adult.low_value, 0) * p_adults) +
    (coalesce(v_medical_child.low_value, 0) * greatest(p_children, 0));

  v_mid_total :=
    v_housing.mid_value +
    v_transport.mid_value +
    v_grocery.mid_value +
    v_utilities.mid_value +
    v_fibre.mid_value +
    (v_mobile.mid_value * greatest(p_adults, 1)) +
    coalesce(v_school.mid_value, 0) * greatest(p_children, 0) +
    coalesce(v_childcare.mid_value, 0) * greatest(p_children, 0) +
    v_domestic.mid_value +
    v_backup.mid_value +
    (coalesce(v_medical_adult.mid_value, 0) * p_adults) +
    (coalesce(v_medical_child.mid_value, 0) * greatest(p_children, 0));

  v_high_total :=
    v_housing.high_value +
    v_transport.high_value +
    v_grocery.high_value +
    v_utilities.high_value +
    v_fibre.high_value +
    (v_mobile.high_value * greatest(p_adults, 1)) +
    coalesce(v_school.high_value, 0) * greatest(p_children, 0) +
    coalesce(v_childcare.high_value, 0) * greatest(p_children, 0) +
    v_domestic.high_value +
    v_backup.high_value +
    (coalesce(v_medical_adult.high_value, 0) * p_adults) +
    (coalesce(v_medical_child.high_value, 0) * greatest(p_children, 0));

  v_base_total :=
    v_housing_selected +
    v_transport_selected +
    v_grocery_selected +
    v_utilities_selected +
    v_fibre_selected +
    v_mobile_selected +
    v_school_selected +
    v_childcare_selected +
    v_domestic_selected +
    v_backup_selected +
    v_medical_selected;

  select *
  into v_salary
  from public.calculate_salary_thresholds(v_base_total, p_lifestyle_tier);

  v_affordability := public.calculate_affordability_band(
    p_net_monthly_income,
    v_salary.workable_net_salary,
    v_salary.comfortable_net_salary
  );

  v_overall_confidence := case least(
    public.confidence_rank(v_housing.confidence),
    public.confidence_rank(v_transport.confidence),
    public.confidence_rank(v_school_confidence),
    public.confidence_rank(v_medical_confidence)
  )
    when 1 then 'low'::public.confidence_level
    when 2 then 'medium'::public.confidence_level
    else 'high'::public.confidence_level
  end;

  v_drivers := jsonb_build_array(
    format('Housing is the largest modeled cost driver in %s.', v_suburb.name),
    case
      when p_children > 0 and p_school_type <> 'none' then 'School choice is a major swing factor for this household.'
      when p_medical_aid_tier <> 'none' then 'Medical aid materially affects the monthly budget.'
      else 'Transport and housing are the main variables after rent.'
    end,
    case
      when p_work_destination_area = 'remote' then 'Remote work reduces commute pressure materially.'
      when p_commute_days_per_week <= 2 then 'A lighter commute schedule keeps transport relatively contained.'
      else format('Commuting toward %s meaningfully shapes monthly transport costs.', replace(p_work_destination_area::text, '_', ' '))
    end
  );

  return jsonb_build_object(
    'snapshot_id', v_snapshot_id,
    'snapshot_version', (select version_label from public.pricing_snapshots where id = v_snapshot_id),
    'suburb', v_suburb.name,
    'suburb_slug', v_suburb.slug,
    'monthly_cost', jsonb_build_object(
      'low', round(v_low_total, 2),
      'mid', round(v_mid_total, 2),
      'high', round(v_high_total, 2),
      'selected', round(v_base_total, 2)
    ),
    'categories', jsonb_build_object(
      'housing', round(v_housing_selected, 2),
      'transport', round(v_transport_selected, 2),
      'groceries', round(v_grocery_selected, 2),
      'utilities', round(v_utilities_selected, 2),
      'schooling_childcare', round(v_school_selected + v_childcare_selected, 2),
      'healthcare', round(v_medical_selected, 2),
      'connectivity', round(v_fibre_selected + v_mobile_selected, 2),
      'domestic_help', round(v_domestic_selected, 2),
      'backup_power', round(v_backup_selected, 2)
    ),
    'salary_thresholds', jsonb_build_object(
      'workable_net_salary', v_salary.workable_net_salary,
      'comfortable_net_salary', v_salary.comfortable_net_salary,
      'discretionary_rate', v_salary.discretionary_rate,
      'resilience_rate', v_salary.resilience_rate
    ),
    'affordability', v_affordability,
    'confidence', jsonb_build_object(
      'overall', v_overall_confidence,
      'housing', v_housing.confidence,
      'transport', v_transport.confidence,
      'schooling_childcare', v_school_confidence,
      'medical_aid', v_medical_confidence
    ),
    'assumptions', jsonb_build_object(
      'adults', p_adults,
      'children', p_children,
      'lifestyle_tier', p_lifestyle_tier,
      'bedrooms', p_bedrooms,
      'parking_spaces', p_parking_spaces,
      'property_type', p_property_type,
      'work_destination_area', p_work_destination_area,
      'cars', p_cars,
      'commute_days_per_week', p_commute_days_per_week,
      'school_type', p_school_type,
      'childcare', p_childcare,
      'domestic_help', p_domestic_help,
      'medical_aid_tier', p_medical_aid_tier,
      'fibre_tier', p_fibre_tier,
      'mobile_tier', p_mobile_tier,
      'backup_power', p_backup_power
    ),
    'drivers', v_drivers
  );
end;
$$;

create or replace function public.resolve_housing_estimate(
  p_suburb_id uuid,
  p_bedrooms smallint,
  p_parking_spaces smallint default 0,
  p_property_type public.property_type default 'any',
  p_lifestyle_tier public.lifestyle_tier default 'balanced',
  p_snapshot_id uuid default null,
  p_housing_override numeric default null
)
returns table (
  snapshot_id uuid,
  suburb_id uuid,
  housing_mode public.housing_mode,
  property_type public.property_type,
  bedrooms smallint,
  parking_spaces smallint,
  low_value numeric,
  mid_value numeric,
  high_value numeric,
  selected_value numeric,
  confidence public.confidence_level,
  metadata jsonb
)
language plpgsql
stable
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
begin
  if p_housing_override is not null then
    return query
    select
      v_snapshot_id,
      p_suburb_id,
      'rent'::public.housing_mode,
      coalesce(nullif(p_property_type, 'any'::public.property_type), 'apartment'::public.property_type),
      p_bedrooms,
      p_parking_spaces,
      p_housing_override,
      p_housing_override,
      p_housing_override,
      p_housing_override,
      'high'::public.confidence_level,
      jsonb_build_object('override', true);
    return;
  end if;

  return query
  with candidates as (
    select
      hc.*,
      case
        when p_property_type = 'any' and hc.property_type = 'any' then 0
        when hc.property_type = p_property_type then 0
        when p_property_type = 'any' then 1
        when hc.property_type = 'any' then 1
        else 2
      end as property_rank,
      abs(hc.bedrooms - p_bedrooms) as bedroom_distance,
      abs(hc.parking_spaces - p_parking_spaces) as parking_distance
    from public.housing_costs hc
    where hc.snapshot_id = v_snapshot_id
      and hc.suburb_id = p_suburb_id
      and hc.housing_mode = 'rent'
  ),
  ranked as (
    select
      c.*,
      row_number() over (
        order by
          c.property_rank,
          c.bedroom_distance,
          c.parking_distance,
          c.source_count desc,
          c.created_at asc
      ) as rn
    from candidates c
  )
  select
    r.snapshot_id,
    r.suburb_id,
    r.housing_mode,
    r.property_type,
    r.bedrooms,
    r.parking_spaces,
    r.low_value,
    r.mid_value,
    r.high_value,
    public.pick_modeled_value(r.low_value, r.mid_value, r.high_value, p_lifestyle_tier) as selected_value,
    r.confidence,
    coalesce(r.metadata, '{}'::jsonb) || jsonb_build_object(
      'requested_bedrooms', p_bedrooms,
      'requested_property_type', p_property_type,
      'requested_parking_spaces', p_parking_spaces,
      'bedroom_distance', abs(r.bedrooms - p_bedrooms),
      'parking_distance', abs(r.parking_spaces - p_parking_spaces),
      'fallback_used', (r.bedrooms <> p_bedrooms or (p_property_type <> 'any' and r.property_type <> p_property_type))
    )
  from ranked r
  where r.rn = 1;
end;
$$;

create or replace function public.calculate_suburb_quote_from_scenario_input(
  p_scenario_input_id uuid,
  p_suburb_id uuid default null,
  p_snapshot_id uuid default null
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_input public.scenario_inputs%rowtype;
  v_target_suburb_id uuid;
begin
  select *
  into v_input
  from public.scenario_inputs si
  where si.id = p_scenario_input_id;

  if not found then
    raise exception 'Scenario input % not found', p_scenario_input_id;
  end if;

  v_target_suburb_id := coalesce(p_suburb_id, v_input.selected_suburb_ids[1]);

  return public.calculate_suburb_quote(
    p_suburb_id := v_target_suburb_id,
    p_adults := v_input.adults,
    p_children := v_input.children,
    p_lifestyle_tier := v_input.lifestyle_tier,
    p_bedrooms := v_input.bedrooms,
    p_parking_spaces := v_input.parking_spaces,
    p_property_type := v_input.property_type,
    p_housing_override := v_input.housing_override,
    p_work_destination_area := v_input.work_destination_area,
    p_cars := v_input.cars,
    p_commute_days_per_week := v_input.commute_days_per_week,
    p_uses_uber := v_input.uses_uber,
    p_uber_trips_per_month := v_input.uber_trips_per_month,
    p_uses_public_transport := v_input.uses_public_transport,
    p_school_type := v_input.school_type,
    p_childcare := v_input.childcare,
    p_domestic_help := v_input.domestic_help,
    p_medical_aid_tier := v_input.medical_aid_tier,
    p_fibre_tier := v_input.fibre_tier,
    p_mobile_tier := v_input.mobile_tier,
    p_backup_power := v_input.backup_power,
    p_net_monthly_income := v_input.net_monthly_income,
    p_snapshot_id := p_snapshot_id
  );
end;
$$;

create or replace function public.normalize_housing_listing_samples_to_costs(
  p_snapshot_id uuid default null
)
returns table (
  suburb_id uuid,
  property_type public.property_type,
  bedrooms smallint,
  parking_spaces smallint,
  low_value numeric,
  mid_value numeric,
  high_value numeric,
  confidence public.confidence_level,
  source_count integer
)
language plpgsql
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
begin
  if v_snapshot_id is null then
    raise exception 'No live pricing snapshot found';
  end if;

  insert into public.housing_costs (
    snapshot_id,
    suburb_id,
    housing_mode,
    property_type,
    bedrooms,
    parking_spaces,
    low_value,
    mid_value,
    high_value,
    confidence,
    source_count,
    metadata
  )
  select
    v_snapshot_id as snapshot_id,
    grouped.suburb_id,
    'rent'::public.housing_mode as housing_mode,
    grouped.property_type,
    grouped.bedrooms,
    grouped.parking_spaces,
    grouped.low_value,
    grouped.mid_value,
    grouped.high_value,
    grouped.confidence,
    grouped.source_count,
    jsonb_build_object(
      'normalization_method', 'direct_sample_aggregation',
      'sample_min_rent', grouped.low_value,
      'sample_max_rent', grouped.high_value,
      'sample_median_rent', grouped.mid_value,
      'source_count', grouped.source_count,
      'derived_from_table', 'housing_listing_samples',
      'notes',
        case
          when grouped.source_count = 1 then 'Single verified sample for this suburb/property/bedroom combination.'
          else 'Aggregated from multiple verified listing samples for this suburb/property/bedroom combination.'
        end
    )
  from (
    select
      hls.suburb_id,
      hls.property_type,
      hls.bedrooms,
      coalesce(max(hls.parking_spaces), 0)::smallint as parking_spaces,
      round(min(hls.monthly_rent_zar), 2) as low_value,
      round(percentile_cont(0.5) within group (order by hls.monthly_rent_zar)::numeric, 2) as mid_value,
      round(max(hls.monthly_rent_zar), 2) as high_value,
      case
        when count(*) >= 5 then 'high'::public.confidence_level
        when count(*) >= 2 then 'medium'::public.confidence_level
        else 'low'::public.confidence_level
      end as confidence,
      count(*)::integer as source_count
    from public.housing_listing_samples hls
    group by
      hls.suburb_id,
      hls.property_type,
      hls.bedrooms
  ) grouped
  on conflict on constraint housing_costs_unique do update
  set
    low_value = excluded.low_value,
    mid_value = excluded.mid_value,
    high_value = excluded.high_value,
    confidence = excluded.confidence,
    source_count = excluded.source_count,
    metadata = excluded.metadata,
    updated_at = timezone('utc', now());

  return query
  select
    hc.suburb_id,
    hc.property_type,
    hc.bedrooms,
    hc.parking_spaces,
    hc.low_value,
    hc.mid_value,
    hc.high_value,
    hc.confidence,
    hc.source_count
  from public.housing_costs hc
  where hc.snapshot_id = v_snapshot_id
    and hc.metadata ->> 'normalization_method' = 'direct_sample_aggregation'
  order by hc.suburb_id, hc.property_type, hc.bedrooms;
end;
$$;

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
  constraint housing_listing_samples_unique unique (suburb_id, source_id, listing_title, monthly_rent_zar)
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

create or replace function public.resolve_transport_estimate(
  p_suburb_id uuid,
  p_work_destination_area public.work_destination_area,
  p_cars smallint default 0,
  p_commute_days_per_week smallint default 0,
  p_uses_uber boolean default false,
  p_uber_trips_per_month smallint default 0,
  p_uses_public_transport boolean default false,
  p_lifestyle_tier public.lifestyle_tier default 'balanced',
  p_snapshot_id uuid default null
)
returns table (
  snapshot_id uuid,
  suburb_id uuid,
  work_destination_area public.work_destination_area,
  low_value numeric,
  mid_value numeric,
  high_value numeric,
  selected_value numeric,
  confidence public.confidence_level,
  car_fixed_cost numeric,
  car_variable_cost numeric,
  public_transport_cost numeric,
  uber_cost numeric,
  metadata jsonb
)
language plpgsql
stable
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
begin
  return query
  with source_row as (
    select tc.*
    from public.transport_costs tc
    where tc.snapshot_id = v_snapshot_id
      and tc.suburb_id = p_suburb_id
      and tc.work_destination_area = p_work_destination_area
    limit 1
  ),
  modeled as (
    select
      sr.snapshot_id,
      sr.suburb_id,
      sr.work_destination_area,
      0::numeric as car_fixed_cost,
      round(
        case
          when p_uses_public_transport then 0
          else sr.round_trip_km * greatest(p_commute_days_per_week, 0) * 4.3 * sr.per_km_rate
        end,
        2
      ) as car_variable_cost,
      round((case when p_uses_public_transport then sr.public_transport_band else 0 end), 2) as public_transport_cost,
      round((case when p_uses_uber then sr.uber_trip_band * greatest(p_uber_trips_per_month, 0) else 0 end), 2) as uber_cost,
      sr.confidence,
      sr.metadata
    from source_row sr
  ),
  totals as (
    select
      m.*,
      round((m.car_variable_cost + m.public_transport_cost + m.uber_cost) * 0.92, 2) as low_value,
      round((m.car_variable_cost + m.public_transport_cost + m.uber_cost), 2) as mid_value,
      round((m.car_variable_cost + m.public_transport_cost + m.uber_cost) * 1.08, 2) as high_value
    from modeled m
  )
  select
    t.snapshot_id,
    t.suburb_id,
    t.work_destination_area,
    t.low_value,
    t.mid_value,
    t.high_value,
    public.pick_modeled_value(t.low_value, t.mid_value, t.high_value, p_lifestyle_tier) as selected_value,
    t.confidence,
    t.car_fixed_cost,
    t.car_variable_cost,
    t.public_transport_cost,
    t.uber_cost,
    t.metadata
  from totals t;
end;
$$;

create or replace function public.calculate_suburb_quote(
  p_suburb_id uuid,
  p_adults smallint,
  p_children smallint,
  p_lifestyle_tier public.lifestyle_tier,
  p_bedrooms smallint,
  p_parking_spaces smallint default 0,
  p_property_type public.property_type default 'any',
  p_housing_override numeric default null,
  p_work_destination_area public.work_destination_area default 'remote',
  p_cars smallint default 0,
  p_commute_days_per_week smallint default 0,
  p_uses_uber boolean default false,
  p_uber_trips_per_month smallint default 0,
  p_uses_public_transport boolean default false,
  p_school_type public.school_type default 'none',
  p_childcare public.childcare_type default 'none',
  p_domestic_help public.domestic_help_frequency default 'none',
  p_medical_aid_tier public.medical_aid_tier default 'none',
  p_fibre_tier public.fibre_tier default 'none',
  p_mobile_tier public.mobile_tier default 'basic',
  p_backup_power public.backup_power_tier default 'none',
  p_net_monthly_income numeric default null,
  p_snapshot_id uuid default null
)
returns jsonb
language plpgsql
stable
as $$
declare
  v_snapshot_id uuid := coalesce(p_snapshot_id, public.get_live_snapshot_id());
  v_suburb public.suburbs%rowtype;
  v_housing record;
  v_transport record;
  v_grocery record;
  v_utilities record;
  v_fibre record;
  v_school record;
  v_childcare record;
  v_domestic record;
  v_backup record;
  v_salary record;
  v_children smallint := greatest(p_children, 0);
  v_housing_selected numeric := 0;
  v_transport_selected numeric := 0;
  v_grocery_selected numeric := 0;
  v_utilities_selected numeric := 0;
  v_fibre_selected numeric := 0;
  v_school_selected numeric := 0;
  v_childcare_selected numeric := 0;
  v_domestic_selected numeric := 0;
  v_backup_selected numeric := 0;
  v_school_low numeric := 0;
  v_school_mid numeric := 0;
  v_school_high numeric := 0;
  v_childcare_low numeric := 0;
  v_childcare_mid numeric := 0;
  v_childcare_high numeric := 0;
  v_low_total numeric := 0;
  v_mid_total numeric := 0;
  v_high_total numeric := 0;
  v_base_total numeric := 0;
  v_affordability public.affordability_band;
  v_overall_confidence public.confidence_level;
  v_school_confidence public.confidence_level := 'high';
  v_drivers jsonb;
begin
  if v_snapshot_id is null then
    raise exception 'No live pricing snapshot found';
  end if;

  select *
  into v_suburb
  from public.suburbs s
  where s.id = p_suburb_id
    and s.is_active = true;

  if not found then
    raise exception 'Suburb % not found or inactive', p_suburb_id;
  end if;

  select *
  into v_housing
  from public.resolve_housing_estimate(
    p_suburb_id := p_suburb_id,
    p_bedrooms := p_bedrooms,
    p_parking_spaces := p_parking_spaces,
    p_property_type := p_property_type,
    p_lifestyle_tier := p_lifestyle_tier,
    p_snapshot_id := v_snapshot_id,
    p_housing_override := p_housing_override
  );

  if not found then
    raise exception 'No housing band found for suburb %, bedrooms %, property_type %', p_suburb_id, p_bedrooms, p_property_type;
  end if;

  select *
  into v_transport
  from public.resolve_transport_estimate(
    p_suburb_id := p_suburb_id,
    p_work_destination_area := p_work_destination_area,
    p_cars := p_cars,
    p_commute_days_per_week := p_commute_days_per_week,
    p_uses_uber := p_uses_uber,
    p_uber_trips_per_month := p_uber_trips_per_month,
    p_uses_public_transport := p_uses_public_transport,
    p_lifestyle_tier := p_lifestyle_tier,
    p_snapshot_id := v_snapshot_id
  );

  if not found then
    raise exception 'No transport band found for suburb % and work destination %', p_suburb_id, p_work_destination_area;
  end if;

  select * into v_grocery
  from public.resolve_cost_band('grocery', 'base', null, p_adults, v_children, p_lifestyle_tier, v_snapshot_id);

  select * into v_utilities
  from public.resolve_cost_band('utilities', 'base', null, p_adults, v_children, p_lifestyle_tier, v_snapshot_id);

  select * into v_fibre
  from public.resolve_cost_band('fibre', p_fibre_tier::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

  select * into v_domestic
  from public.resolve_cost_band('domestic_help', p_domestic_help::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

  select * into v_backup
  from public.resolve_cost_band('backup_power', p_backup_power::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

  if v_children > 0 then
    select * into v_school
    from public.resolve_cost_band('school', p_school_type::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

    select * into v_childcare
    from public.resolve_cost_band('childcare', p_childcare::text, null, null, null, p_lifestyle_tier, v_snapshot_id);

    v_school_confidence := coalesce(v_school.confidence, 'high'::public.confidence_level);
    v_school_low := coalesce(v_school.low_value, 0);
    v_school_mid := coalesce(v_school.mid_value, 0);
    v_school_high := coalesce(v_school.high_value, 0);
    v_childcare_low := coalesce(v_childcare.low_value, 0);
    v_childcare_mid := coalesce(v_childcare.mid_value, 0);
    v_childcare_high := coalesce(v_childcare.high_value, 0);
  end if;

  if v_grocery.snapshot_id is null
     or v_utilities.snapshot_id is null
     or v_fibre.snapshot_id is null
     or v_domestic.snapshot_id is null
     or v_backup.snapshot_id is null then
    raise exception 'One or more required cost bands are missing for snapshot %', v_snapshot_id;
  end if;

  v_housing_selected := v_housing.selected_value;
  v_transport_selected := v_transport.selected_value;
  v_grocery_selected := v_grocery.selected_value;
  v_utilities_selected := v_utilities.selected_value;
  v_fibre_selected := v_fibre.selected_value;
  v_domestic_selected := v_domestic.selected_value;
  v_backup_selected := v_backup.selected_value;

  if v_children > 0 then
    v_school_selected := round(coalesce(v_school.selected_value, 0) * v_children, 2);
    v_childcare_selected := round(coalesce(v_childcare.selected_value, 0) * v_children, 2);
  else
    v_school_selected := 0;
    v_childcare_selected := 0;
  end if;

  v_low_total :=
    v_housing.low_value +
    v_transport.low_value +
    v_grocery.low_value +
    v_utilities.low_value +
    v_fibre.low_value +
    (v_school_low * v_children) +
    (v_childcare_low * v_children) +
    v_domestic.low_value +
    v_backup.low_value;

  v_mid_total :=
    v_housing.mid_value +
    v_transport.mid_value +
    v_grocery.mid_value +
    v_utilities.mid_value +
    v_fibre.mid_value +
    (v_school_mid * v_children) +
    (v_childcare_mid * v_children) +
    v_domestic.mid_value +
    v_backup.mid_value;

  v_high_total :=
    v_housing.high_value +
    v_transport.high_value +
    v_grocery.high_value +
    v_utilities.high_value +
    v_fibre.high_value +
    (v_school_high * v_children) +
    (v_childcare_high * v_children) +
    v_domestic.high_value +
    v_backup.high_value;

  v_base_total :=
    v_housing_selected +
    v_transport_selected +
    v_grocery_selected +
    v_utilities_selected +
    v_fibre_selected +
    v_school_selected +
    v_childcare_selected +
    v_domestic_selected +
    v_backup_selected;

  select *
  into v_salary
  from public.calculate_salary_thresholds(v_base_total, p_lifestyle_tier);

  v_affordability := public.calculate_affordability_band(
    p_net_monthly_income,
    v_salary.workable_net_salary,
    v_salary.comfortable_net_salary
  );

  v_overall_confidence := case least(
    public.confidence_rank(v_housing.confidence),
    public.confidence_rank(v_transport.confidence),
    public.confidence_rank(v_school_confidence)
  )
    when 1 then 'low'::public.confidence_level
    when 2 then 'medium'::public.confidence_level
    else 'high'::public.confidence_level
  end;

  v_drivers := jsonb_build_array(
    format('Housing is the largest modeled cost driver in %s.', v_suburb.name),
    case
      when v_children > 0 and p_school_type <> 'none' then 'School choice is a major swing factor for this household.'
      else 'Transport and housing are the main variables after rent.'
    end,
    case
      when p_work_destination_area = 'remote' then 'Remote work reduces commute pressure materially.'
      when p_commute_days_per_week <= 2 then 'A lighter commute schedule keeps transport relatively contained.'
      else format('Commuting toward %s meaningfully shapes monthly transport costs.', replace(p_work_destination_area::text, '_', ' '))
    end
  );

  return jsonb_build_object(
    'snapshot_id', v_snapshot_id,
    'snapshot_version', (select version_label from public.pricing_snapshots where id = v_snapshot_id),
    'suburb', v_suburb.name,
    'suburb_slug', v_suburb.slug,
    'monthly_cost', jsonb_build_object(
      'low', round(v_low_total, 2),
      'mid', round(v_mid_total, 2),
      'high', round(v_high_total, 2),
      'selected', round(v_base_total, 2)
    ),
    'categories', jsonb_build_object(
      'housing', round(v_housing_selected, 2),
      'transport', round(v_transport_selected, 2),
      'groceries', round(v_grocery_selected, 2),
      'utilities', round(v_utilities_selected, 2),
      'schooling_childcare', round(v_school_selected + v_childcare_selected, 2),
      'connectivity', round(v_fibre_selected, 2),
      'domestic_help', round(v_domestic_selected, 2),
      'backup_power', round(v_backup_selected, 2)
    ),
    'salary_thresholds', jsonb_build_object(
      'workable_net_salary', v_salary.workable_net_salary,
      'comfortable_net_salary', v_salary.comfortable_net_salary,
      'discretionary_rate', v_salary.discretionary_rate,
      'resilience_rate', v_salary.resilience_rate
    ),
    'affordability', v_affordability,
    'confidence', jsonb_build_object(
      'overall', v_overall_confidence,
      'housing', v_housing.confidence,
      'transport', v_transport.confidence,
      'schooling_childcare', v_school_confidence
    ),
    'assumptions', jsonb_build_object(
      'adults', p_adults,
      'children', v_children,
      'lifestyle_tier', p_lifestyle_tier,
      'bedrooms', p_bedrooms,
      'parking_spaces', p_parking_spaces,
      'property_type', p_property_type,
      'work_destination_area', p_work_destination_area,
      'commute_days_per_week', p_commute_days_per_week,
      'school_type', p_school_type,
      'childcare', p_childcare,
      'domestic_help', p_domestic_help,
      'fibre_tier', p_fibre_tier,
      'backup_power', p_backup_power
    ),
    'drivers', v_drivers
  );
end;
$$;
