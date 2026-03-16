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
