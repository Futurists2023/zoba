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
