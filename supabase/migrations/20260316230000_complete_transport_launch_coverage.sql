insert into public.transport_costs (
  snapshot_id,
  suburb_id,
  work_destination_area,
  round_trip_km,
  per_km_rate,
  car_fixed_band,
  public_transport_band,
  uber_trip_band,
  confidence,
  source_count,
  metadata
)
values
  (
    public.get_live_snapshot_id(),
    'c76b6e04-3306-5577-7812-e49d6602d2c4',
    'cbd',
    14.00,
    4.85,
    0.00,
    1100.00,
    130.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Rondebosch launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'c76b6e04-3306-5577-7812-e49d6602d2c4',
    'century_city',
    30.00,
    4.85,
    0.00,
    1450.00,
    210.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Rondebosch launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'c76b6e04-3306-5577-7812-e49d6602d2c4',
    'claremont',
    8.00,
    4.85,
    0.00,
    500.00,
    80.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Rondebosch launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'c76b6e04-3306-5577-7812-e49d6602d2c4',
    'bellville',
    42.00,
    4.85,
    0.00,
    1650.00,
    250.00,
    'low',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Rondebosch launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'c76b6e04-3306-5577-7812-e49d6602d2c4',
    'remote',
    0.00,
    4.85,
    0.00,
    0.00,
    80.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Rondebosch launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
    'cbd',
    10.00,
    4.85,
    0.00,
    900.00,
    120.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Sea Point launch transport baseline inferred from Atlantic Seaboard proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
    'century_city',
    22.00,
    4.85,
    0.00,
    1350.00,
    180.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Sea Point launch transport baseline inferred from Atlantic Seaboard proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
    'claremont',
    24.00,
    4.85,
    0.00,
    1300.00,
    220.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Sea Point launch transport baseline inferred from Atlantic Seaboard proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
    'bellville',
    36.00,
    4.85,
    0.00,
    1600.00,
    260.00,
    'low',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Sea Point launch transport baseline inferred from Atlantic Seaboard proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
    'remote',
    0.00,
    4.85,
    0.00,
    0.00,
    90.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Sea Point launch transport baseline inferred from Atlantic Seaboard proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'df9651e6-ed98-c46c-14cf-38c0a5d07435',
    'cbd',
    6.00,
    4.85,
    0.00,
    800.00,
    100.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Woodstock launch transport baseline inferred from city-edge proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'df9651e6-ed98-c46c-14cf-38c0a5d07435',
    'century_city',
    16.00,
    4.85,
    0.00,
    1200.00,
    160.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Woodstock launch transport baseline inferred from city-edge proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'df9651e6-ed98-c46c-14cf-38c0a5d07435',
    'claremont',
    16.00,
    4.85,
    0.00,
    950.00,
    150.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Woodstock launch transport baseline inferred from city-edge proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'df9651e6-ed98-c46c-14cf-38c0a5d07435',
    'bellville',
    28.00,
    4.85,
    0.00,
    1450.00,
    210.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Woodstock launch transport baseline inferred from city-edge proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'df9651e6-ed98-c46c-14cf-38c0a5d07435',
    'remote',
    0.00,
    4.85,
    0.00,
    0.00,
    85.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Woodstock launch transport baseline inferred from city-edge proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    '00d90a9b-494b-c150-5634-f84c13fc6bf6',
    'cbd',
    18.00,
    4.85,
    0.00,
    1000.00,
    150.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Century City launch transport baseline inferred from precinct location between CBD and northern suburbs.')
  ),
  (
    public.get_live_snapshot_id(),
    '00d90a9b-494b-c150-5634-f84c13fc6bf6',
    'century_city',
    4.00,
    4.85,
    0.00,
    350.00,
    60.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Century City launch transport baseline inferred from precinct location between CBD and northern suburbs.')
  ),
  (
    public.get_live_snapshot_id(),
    '00d90a9b-494b-c150-5634-f84c13fc6bf6',
    'claremont',
    32.00,
    4.85,
    0.00,
    1450.00,
    220.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Century City launch transport baseline inferred from precinct location between CBD and northern suburbs.')
  ),
  (
    public.get_live_snapshot_id(),
    '00d90a9b-494b-c150-5634-f84c13fc6bf6',
    'bellville',
    20.00,
    4.85,
    0.00,
    1150.00,
    160.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Century City launch transport baseline inferred from precinct location between CBD and northern suburbs.')
  ),
  (
    public.get_live_snapshot_id(),
    '00d90a9b-494b-c150-5634-f84c13fc6bf6',
    'remote',
    0.00,
    4.85,
    0.00,
    0.00,
    85.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Century City launch transport baseline inferred from precinct location between CBD and northern suburbs.')
  ),
  (
    public.get_live_snapshot_id(),
    '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
    'cbd',
    54.00,
    4.85,
    0.00,
    1850.00,
    280.00,
    'low',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Durbanville launch transport baseline inferred from northern suburban position.')
  ),
  (
    public.get_live_snapshot_id(),
    '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
    'century_city',
    36.00,
    4.85,
    0.00,
    1550.00,
    220.00,
    'low',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Durbanville launch transport baseline inferred from northern suburban position.')
  ),
  (
    public.get_live_snapshot_id(),
    '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
    'claremont',
    56.00,
    4.85,
    0.00,
    1900.00,
    300.00,
    'low',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Durbanville launch transport baseline inferred from northern suburban position.')
  ),
  (
    public.get_live_snapshot_id(),
    '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
    'bellville',
    20.00,
    4.85,
    0.00,
    950.00,
    140.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Durbanville launch transport baseline inferred from northern suburban position.')
  ),
  (
    public.get_live_snapshot_id(),
    '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
    'remote',
    0.00,
    4.85,
    0.00,
    0.00,
    85.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Durbanville launch transport baseline inferred from northern suburban position.')
  ),
  (
    public.get_live_snapshot_id(),
    'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
    'cbd',
    16.00,
    4.85,
    0.00,
    1200.00,
    140.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Newlands launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
    'century_city',
    32.00,
    4.85,
    0.00,
    1500.00,
    220.00,
    'medium',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Newlands launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
    'claremont',
    8.00,
    4.85,
    0.00,
    550.00,
    90.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Newlands launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
    'bellville',
    44.00,
    4.85,
    0.00,
    1700.00,
    260.00,
    'low',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Newlands launch transport baseline inferred from Southern Suburbs proximity.')
  ),
  (
    public.get_live_snapshot_id(),
    'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
    'remote',
    0.00,
    4.85,
    0.00,
    0.00,
    80.00,
    'high',
    1,
    jsonb_build_object('normalization_method', 'transitional_seed', 'notes', 'Newlands launch transport baseline inferred from Southern Suburbs proximity.')
  )
on conflict on constraint transport_costs_unique do update
set
  round_trip_km = excluded.round_trip_km,
  per_km_rate = excluded.per_km_rate,
  car_fixed_band = excluded.car_fixed_band,
  public_transport_band = excluded.public_transport_band,
  uber_trip_band = excluded.uber_trip_band,
  confidence = excluded.confidence,
  source_count = excluded.source_count,
  metadata = excluded.metadata;

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
