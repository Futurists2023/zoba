create extension if not exists pgcrypto;

truncate table public.school_reviews restart identity cascade;
truncate table public.schools restart identity cascade;
truncate table public.suburbs restart identity cascade;
truncate table public.regions restart identity cascade;

insert into public.regions (name, slug, description)
values ('Midrand', 'midrand', 'AffordableSchools Midrand Phase 1 target region');

with region as (
  select id from public.regions where slug = 'midrand'
)
insert into public.suburbs (region_id, name, slug, median_budget_band, pitch, latitude, longitude)
select region.id, v.name, v.slug, v.median_budget_band, v.pitch, v.latitude, v.longitude
from region,
(
  values
    ('Noordwyk', 'noordwyk', 'R4 500-R8 000 monthly', 'Popular with practical family budgets and quick N1 access.', -25.966000, 28.126000),
    ('Halfway Gardens', 'halfway-gardens', 'R5 500-R9 500 monthly', 'Central Midrand location with balanced commute options.', -25.986000, 28.123000),
    ('Vorna Valley', 'vorna-valley', 'R5 000-R8 500 monthly', 'Convenient for families prioritising practical routes and aftercare.', -26.008000, 28.116000),
    ('Buccleuch', 'buccleuch', 'R5 000-R8 500 monthly', 'Useful for households balancing Midrand and Sandton work patterns.', -26.058000, 28.099000),
    ('Carlswald', 'carlswald', 'R6 500-R11 000 monthly', 'A family-oriented pocket with many private-school options nearby.', -25.946000, 28.139000),
    ('Kyalami', 'kyalami', 'R8 500-R13 000 monthly', 'Good for families who value facilities, sport, and more space.', -25.964000, 28.071000),
    ('Barbeque Downs', 'barbeque-downs', 'R6 000-R9 500 monthly', 'Compact suburb that suits practical commuting and mixed school choices.', -26.023000, 28.094000),
    ('Waterfall', 'waterfall', 'R8 000-R14 000 monthly', 'Newer family nodes with stronger premium-school spillover.', -26.018000, 28.103000),
    ('Blue Hills', 'blue-hills', 'R5 500-R9 000 monthly', 'Useful for families seeking more value while staying in the Midrand orbit.', -25.928000, 28.101000),
    ('Glen Austin', 'glen-austin', 'R6 500-R10 500 monthly', 'A quieter Midrand pocket with a mix of established and boutique schools.', -25.958000, 28.152000)
) as v(name, slug, median_budget_band, pitch, latitude, longitude);

with school_rows(name, slug, suburb_slug, school_type, annual_fee_min, annual_fee_max, registration_fee, deposit_fee, aftercare_available, transport_available, swimming_available, sports, facilities, must_have_features, nice_to_have_features, curriculum, religious_affiliation, class_size_estimate, latitude_offset, longitude_offset, distance_from_suburb_center_km) as (
  values
    ('Midrand English Medium Primary School','midrand-english-medium-primary-school','noordwyk','public',18000,26000,1200,2200,true,false,false,array['Soccer','Netball','Cricket'],array['Library','Hall','Playground'],array['Aftercare','Soccer','Library'],array['Meal option','Extra murals'],'CAPS',null,31,0.003,-0.004,2.3),
    ('Midrand Christian College','midrand-christian-college','noordwyk','private_mid_tier',62000,89000,6500,9500,true,true,true,array['Soccer','Rugby','Netball','Music'],array['Library','Swimming pool','Computer lab'],array['Aftercare','Transport','Music'],array['Modern classrooms','Holiday care'],'CAPS with Christian enrichment','Christian',24,-0.002,0.003,3.1),
    ('Midrand Montessori Preschool and Primary','midrand-montessori-preschool-and-primary','noordwyk','private_mid_tier',58000,81000,5500,8200,true,true,false,array['Soccer','Music'],array['Garden classrooms','Library','Art room'],array['Small classes','Aftercare'],array['Modern classrooms','Holiday care'],'Montessori',null,18,0.004,0.001,1.8),
    ('Halfway House Primary School','halfway-house-primary-school','halfway-gardens','public',16000,24000,1000,1800,true,false,false,array['Soccer','Netball','Cricket'],array['Library','Hall','Computer lab'],array['Aftercare','Soccer'],array['Library','Meal option'],'CAPS',null,33,0.001,-0.002,2.1),
    ('Laerskool Halfway House','laerskool-halfway-house','halfway-gardens','public',15000,22500,950,1650,true,false,false,array['Rugby','Cricket','Netball'],array['Library','Sports fields','Hall'],array['Aftercare','Rugby','Cricket'],array['Meal option','Extra murals'],'CAPS',null,32,-0.003,-0.004,2.8),
    ('Christ Church Preparatory School and College','christ-church-preparatory-school-and-college','halfway-gardens','private_mid_tier',70000,96000,7000,10500,true,true,true,array['Soccer','Netball','Music','Swimming'],array['Library','Swimming pool','STEM lab'],array['Aftercare','Transport','Swimming'],array['Coding/Robotics','Modern classrooms'],'CAPS','Christian',23,0.004,0.002,3.6),
    ('Cedarwood School','cedarwood-school','vorna-valley','private_mid_tier',52000,76000,4800,7600,true,true,false,array['Soccer','Netball','Music'],array['Library','Therapy room','Computer lab'],array['Aftercare','Transport','Small classes'],array['Modern classrooms','Holiday care'],'Learner support CAPS',null,16,0.002,0.003,2.9),
    ('Modern Montessori International','modern-montessori-international','vorna-valley','private_mid_tier',61000,86000,6000,8400,true,false,false,array['Music','Soccer'],array['Art studio','Garden classrooms','Library'],array['Small classes','Aftercare'],array['Modern classrooms','Library'],'Montessori',null,17,-0.002,0.002,2.6),
    ('Curro Midrand Sagewood','curro-midrand-sagewood','vorna-valley','private_mid_tier',78000,112000,7500,12000,true,true,true,array['Swimming','Soccer','Cricket','Netball'],array['Swimming pool','STEM lab','Library'],array['Aftercare','Transport','Swimming'],array['Coding/Robotics','Modern classrooms'],'CAPS',null,24,0.004,-0.003,4.7),
    ('SPARK Midrand','spark-midrand','buccleuch','private_low_fee',32000,46000,2500,3600,true,false,false,array['Soccer','Netball'],array['Modern classrooms','Computer lab'],array['Aftercare','Coding/Robotics'],array['Modern classrooms','Sibling discount'],'CAPS',null,28,0.003,0.003,4.2),
    ('Midrand Muslim School','midrand-muslim-school','buccleuch','private_low_fee',36000,52000,2800,4000,true,true,false,array['Soccer','Netball','Cricket'],array['Library','Prayer space','Computer lab'],array['Transport','Religious alignment'],array['Meal option','Extra murals'],'CAPS','Muslim',27,-0.002,-0.001,4.8),
    ('Midrand Primary and High School','midrand-primary-and-high-school','buccleuch','public',14000,21000,950,1500,true,false,false,array['Soccer','Netball'],array['Library','Hall','Computer lab'],array['Aftercare','Soccer'],array['Meal option','Library'],'CAPS',null,34,0.001,-0.003,5.4),
    ('Beaulieu Preparatory School','beaulieu-preparatory-school','carlswald','private_premium',128000,162000,12000,18000,true,true,true,array['Swimming','Rugby','Cricket','Music'],array['Equestrian access','Swimming pool','Library'],array['Transport','Swimming','Small classes'],array['Modern classrooms','Holiday care'],'CAPS',null,19,0.003,0.004,3.2),
    ('Maria Montessori House of Children','maria-montessori-house-of-children','carlswald','private_mid_tier',64000,92000,6200,9000,true,false,false,array['Music','Soccer'],array['Garden classrooms','Library','Art room'],array['Small classes','Aftercare'],array['Modern classrooms','Library'],'Montessori',null,16,-0.003,0.001,2.5),
    ('Summerhill College','summerhill-college','carlswald','private_mid_tier',76000,108000,7800,12200,true,true,true,array['Swimming','Soccer','Cricket','Netball'],array['Swimming pool','Library','Computer lab'],array['Aftercare','Transport','Swimming'],array['Coding/Robotics','Modern classrooms'],'CAPS',null,24,0.002,-0.002,3.9),
    ('Kyalami Preparatory School','kyalami-preparatory-school','kyalami','private_premium',136000,170000,13000,19000,true,true,true,array['Swimming','Rugby','Cricket','Netball'],array['Swimming pool','Library','Sports fields'],array['Swimming','Transport','Small classes'],array['Holiday care','Modern classrooms'],'CAPS',null,18,0.003,-0.003,3.8),
    ('Jubilate Primary School','jubilate-primary-school','kyalami','private_low_fee',30000,44000,2400,3500,true,true,false,array['Soccer','Netball','Music'],array['Library','Hall','Computer lab'],array['Aftercare','Transport','Music'],array['Meal option','Holiday care'],'CAPS','Christian',26,-0.004,0.002,4.4),
    ('Midrand Christian Academy','midrand-christian-academy','kyalami','private_low_fee',34000,49000,2600,3800,true,true,false,array['Soccer','Netball','Music'],array['Library','Assembly hall','Computer lab'],array['Aftercare','Transport','Religious alignment'],array['Meal option','Sibling discount'],'CAPS','Christian',28,0.001,0.004,4.9),
    ('Noor Training Centre','noor-training-centre','barbeque-downs','private_low_fee',26000,39000,2100,3000,true,true,false,array['Soccer','Netball'],array['Library','Prayer space','Computer lab'],array['Transport','Religious alignment'],array['Meal option','Holiday care'],'CAPS','Muslim',27,0.002,-0.004,3.4),
    ('Bonwelong Primary School','bonwelong-primary-school','barbeque-downs','public',12000,19500,900,1400,false,false,false,array['Soccer','Netball'],array['Hall','Playground'],array['Soccer'],array['Meal option','Extra murals'],'CAPS',null,36,-0.003,0.001,3.9),
    ('Eqinisweni Primary School','eqinisweni-primary-school','waterfall','public',12500,20000,850,1350,false,false,false,array['Soccer','Netball'],array['Hall','Playground','Computer lab'],array['Soccer'],array['Library','Meal option'],'CAPS',null,35,-0.001,-0.002,5.1),
    ('Reddam House Waterfall','reddam-house-waterfall','waterfall','private_premium',142000,178000,13500,21000,true,true,true,array['Swimming','Rugby','Cricket','Music'],array['Performing arts centre','Swimming pool','Library'],array['Transport','Swimming','Music'],array['Coding/Robotics','Modern classrooms'],'IEB-aligned primary',null,20,0.004,-0.001,4.2),
    ('Waterfall Montessori','waterfall-montessori','waterfall','private_mid_tier',68000,93000,6500,9800,true,false,false,array['Music','Soccer'],array['Garden classrooms','Art room','Library'],array['Small classes','Aftercare'],array['Modern classrooms','Holiday care'],'Montessori',null,17,0.002,0.003,3.6),
    ('Reddford House Blue Hills','reddford-house-blue-hills','blue-hills','private_premium',138000,172000,13200,19600,true,true,true,array['Swimming','Soccer','Cricket','Music'],array['Swimming pool','Library','STEM lab'],array['Transport','Swimming','Music'],array['Coding/Robotics','Modern classrooms'],'IEB-aligned primary',null,21,0.002,-0.002,4.8),
    ('Blue Hills College','blue-hills-college','blue-hills','private_low_fee',28000,42000,2200,3200,true,true,false,array['Soccer','Netball','Cricket'],array['Library','Hall','Computer lab'],array['Aftercare','Transport'],array['Meal option','Sibling discount'],'CAPS',null,29,-0.003,0.003,3.3),
    ('Nizamiye School','nizamiye-school','blue-hills','private_mid_tier',54000,76000,5200,7600,true,true,true,array['Swimming','Soccer','Music'],array['Library','Prayer space','Science lab'],array['Transport','Swimming','Religious alignment'],array['Modern classrooms','Meal option'],'CAPS','Muslim',23,0.004,0.002,4.1),
    ('Phumulani Primary School','phumulani-primary-school','glen-austin','public',12000,19000,850,1350,false,false,false,array['Soccer','Netball'],array['Hall','Playground'],array['Soccer'],array['Meal option','Extra murals'],'CAPS',null,37,0.002,-0.004,3.8),
    ('Glen Austin Primary School','glen-austin-primary-school','glen-austin','public',13500,20500,900,1450,true,false,false,array['Soccer','Cricket','Netball'],array['Library','Hall','Playground'],array['Aftercare','Cricket'],array['Library','Extra murals'],'CAPS',null,33,-0.002,0.001,2.7),
    ('Noordwyk Primary School','noordwyk-primary-school','glen-austin','public',14500,21500,950,1600,true,false,false,array['Soccer','Netball','Music'],array['Library','Computer lab','Playground'],array['Aftercare','Music'],array['Meal option','Library'],'CAPS',null,31,0.003,0.002,4.3)
)
insert into public.schools (
  suburb_id, name, slug, school_type, grades_from, grades_to, annual_fee_min, annual_fee_max, monthly_estimate,
  registration_fee, deposit_fee, aftercare_available, transport_available, swimming_available, sports, facilities,
  must_have_features, nice_to_have_features, curriculum, religious_affiliation, class_size_estimate, latitude, longitude,
  distance_from_suburb_center_km, review_score, review_count
)
select
  sub.id,
  rows.name,
  rows.slug,
  rows.school_type::public.school_type,
  'Grade R',
  'Grade 7',
  rows.annual_fee_min,
  rows.annual_fee_max,
  round(rows.annual_fee_max / 12.0, 2),
  rows.registration_fee,
  rows.deposit_fee,
  rows.aftercare_available,
  rows.transport_available,
  rows.swimming_available,
  rows.sports,
  rows.facilities,
  rows.must_have_features,
  rows.nice_to_have_features,
  rows.curriculum,
  rows.religious_affiliation,
  rows.class_size_estimate,
  sub.latitude + rows.latitude_offset,
  sub.longitude + rows.longitude_offset,
  rows.distance_from_suburb_center_km,
  round(3.6 + ((row_number() over (order by rows.slug) * 37 % 12) / 10.0), 2),
  0
from school_rows rows
join public.suburbs sub on sub.slug = rows.suburb_slug;

insert into public.school_reviews (
  school_id,
  reviewer_alias,
  overall_score,
  headline,
  body,
  pros,
  cons,
  grade_relevant_to_review,
  dimension_scores,
  created_at
)
select
  s.id,
  case (g.n % 5)
    when 0 then 'Parent from ' || sub.name
    when 1 then 'Grade family in ' || sub.name
    when 2 then 'Midrand guardian ' || sub.name
    when 3 then 'Working parent in ' || sub.name
    else 'Aftercare parent from ' || sub.name
  end,
  round(greatest(3.3, least(4.9, s.review_score + ((g.n % 3) - 1) * 0.1)), 2),
  case (g.n % 5)
    when 0 then 'Balanced option for practical families'
    when 1 then 'Good value if transport matters'
    when 2 then 'Helpful staff and solid routines'
    when 3 then 'Strong fit for a tighter budget'
    else 'Worth considering for daily logistics'
  end,
  case (g.n % 5)
    when 0 then 'Our child settled quickly and the school feels practical for families watching both fees and travel time.'
    when 1 then 'The experience feels structured, and the value is easier to justify than some pricier Midrand options nearby.'
    when 2 then 'Communication has been steady and the daily routine feels manageable for a working household.'
    when 3 then 'It is not the flashiest campus, but it covers the basics well and the overall cost feels more realistic.'
    else 'This school stood out because the tradeoff between fees, location, and activities felt easier to manage.'
  end,
  array['Clear daily routine', 'Budget feels manageable'],
  array['Busy drop-off times'],
  'Grade R',
  jsonb_build_object(
    'overallSatisfaction', round(greatest(3.3, least(4.9, s.review_score + ((g.n % 3) - 1) * 0.1)), 2),
    'valueForMoney', round(greatest(3.0, s.review_score - 0.1), 2),
    'communication', round(least(5.0, s.review_score + 0.1), 2),
    'facilities', round(greatest(3.2, s.review_score - 0.2), 2),
    'sportsAndActivities', round(greatest(3.1, s.review_score - 0.1), 2),
    'aftercareQuality', round(greatest(3.0, s.review_score - 0.2), 2),
    'safetyAndCleanliness', round(least(5.0, s.review_score + 0.2), 2),
    'childHappiness', round(least(5.0, s.review_score + 0.1), 2)
  ),
  timezone('utc', now()) - make_interval(days => g.n * 14)
from public.schools s
join public.suburbs sub on sub.id = s.suburb_id
cross join lateral generate_series(1, 3 + (abs(hashtextextended(s.slug, 0)) % 4)) as g(n);

update public.schools s
set review_count = counts.review_count,
    review_score = counts.review_score
from (
  select school_id, count(*)::int as review_count, round(avg(overall_score), 2) as review_score
  from public.school_reviews
  group by school_id
) counts
where counts.school_id = s.id;

