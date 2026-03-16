begin;

insert into public.suburbs (
  id,
  name,
  slug,
  city,
  region_group,
  is_active,
  metadata
)
values
(
  '22222222-2222-2222-2222-222222222222',
  'Claremont',
  'claremont',
  'Cape Town',
  'southern_suburbs',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism describes Claremont as a vibrant Southern Suburbs neighbourhood with diverse communities and plenty to see and do.","data_gaps":["No suburb-level transport distance pack has been compiled yet.","Residential samples are direct listings, not normalized rent bands."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '70b49d94-abd3-0856-dc87-3ef946b78b46',
  'Observatory',
  'observatory',
  'Cape Town',
  'city_bowl_edge',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism describes Observatory as a creative, bohemian neighbourhood with thrift stores, cafes, bars, and a laid-back local identity.","data_gaps":["Transport values still need direct map-based verification.","Some Observatory listings are house-share stock and should be excluded from future rent-band modeling."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '985c32e4-396e-9819-8aaa-d83253a7bfc4',
  'Table View',
  'table-view',
  'Cape Town',
  'western_seaboard',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism says Table View is named after its views of Table Mountain and positions it as a suburban neighbourhood close to the western seaboard beach lifestyle.","data_gaps":["No verified suburb-specific commute set has been added yet.","Beachfront and inland Table View stock should be split later because pricing differs."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '6ff666ec-9ddf-3d14-f493-035f196ea1d1',
  'Bellville',
  'bellville',
  'Cape Town',
  'northern_suburbs',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism describes Bellville as a residential, industrial, and commercial area in Cape Town''s Northern Suburbs with access to shopping and family attractions.","data_gaps":["Bellville results span multiple sub-areas; later migration should normalize by sub-area where needed.","Residential samples here are broad Bellville market observations, not a single micro-node."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'c76b6e04-3306-5577-7812-e49d6602d2c4',
  'Rondebosch',
  'rondebosch',
  'Cape Town',
  'southern_suburbs',
  true,
  '{"country":"South Africa","summary":"UCT states that its Groote Schuur Campus is situated in the suburb of Rondebosch, giving the area a strong education anchor.","data_gaps":["Need a cleaner full-category rental count capture.","Student-oriented room-share stock near UCT needs separate treatment from standard household rentals."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
  'Sea Point',
  'sea-point',
  'Cape Town',
  'atlantic_seaboard',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism positions Sea Point as an Atlantic Seaboard neighbourhood between Signal Hill and the ocean, anchored by the promenade and a strong apartment market.","data_gaps":["A number of Sea Point listings are furnished or short-term biased and should be flagged during migration.","Future migration should split studio and one-bed apartment stock cleanly."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'df9651e6-ed98-c46c-14cf-38c0a5d07435',
  'Woodstock',
  'woodstock',
  'Cape Town',
  'city_bowl_edge',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism describes Woodstock as one of Cape Town''s oldest suburbs and a creative hub with food, design, and street art.","data_gaps":["House-share and student-leaning Woodstock stock needs separate treatment from standard household rentals.","The Woodstock search result set needs one cleaner category scrape in the migration phase."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '00d90a9b-494b-c150-5634-f84c13fc6bf6',
  'Century City',
  'century-city',
  'Cape Town',
  'northern_gateway',
  true,
  '{"country":"South Africa","summary":"The official Century City precinct page describes the area as a 250-hectare mixed-use business and lifestyle precinct halfway between the Cape Town CBD and the northern suburbs.","data_gaps":["Century City includes a high share of furnished and short-stay stock, so long-term migration rules need extra filtering.","Residential stock should later be separated by estate or development where possible."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
  'Durbanville',
  'durbanville',
  'Cape Town',
  'northern_suburbs',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism describes Durbanville as a Cape Town winelands town with outdoor recreation and access to nearby wineries.","data_gaps":["Durbanville samples span multiple sub-areas such as Amanda Glen, Vierlanden, and Durbanville Central.","Migration should likely treat Durbanville micro-areas separately if suburb-level precision is required."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
  'Newlands',
  'newlands',
  'Cape Town',
  'southern_suburbs',
  true,
  '{"country":"South Africa","summary":"Cape Town Tourism describes Newlands as a leafy Southern Suburbs neighbourhood known for nature, sport, and mountain access.","data_gaps":["Newlands stock includes premium furnished and short-lease options that should be tagged during migration.","A full category count for Newlands residential listings still needs one clean capture."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  city = excluded.city,
  region_group = excluded.region_group,
  is_active = excluded.is_active,
  metadata = public.suburbs.metadata || excluded.metadata;

insert into public.research_sources (
  id,
  url,
  title,
  publisher,
  source_type,
  date_published,
  date_accessed,
  metadata
)
values
(
  '89b5387c-c9c2-2158-1ccb-e98862b48817',
  'https://canalwalk.co.za/page/Century-City-Precinct',
  'Century City Precinct | Canal Walk Shopping',
  'Canal Walk',
  'official'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '8590aab3-6abf-3f98-fbaa-0a2a4c95548c',
  'https://cavendish.co.za/',
  'Cavendish Square',
  'Cavendish Square',
  'official'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'bcaa351e-bd36-4ee8-c180-d75194b57c73',
  'https://durbanvillewine.co.za/',
  'Home | Durbanville Wine Valley',
  'Durbanville Wine Valley',
  'official'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '595f5aa0-7ff7-ec8d-c53d-6bc588f636f2',
  'https://theoldbiscuitmill.co.za/',
  'The Old Biscuit Mill - Cape Town Shopping, Dining & Entertainment',
  'The Old Biscuit Mill',
  'official'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '552f3246-6c40-fbfe-cd92-b3074776671f',
  'https://www.capetown.travel/neighbourhood/bellville/',
  'Bellville - Cape Town Tourism',
  'Cape Town Tourism',
  'publisher'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '8b323179-ba15-d277-8da1-2b6ca1cd0e3a',
  'https://www.capetown.travel/neighbourhood/sea-point/',
  'Sea Point - Cape Town Tourism',
  'Cape Town Tourism',
  'publisher'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '87fb8e74-b456-007a-ac5d-fbb671022612',
  'https://www.capetown.travel/neighbourhoods/table-view/',
  'Table View - Cape Town Tourism',
  'Cape Town Tourism',
  'publisher'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'f2cd9478-bc18-0842-d8ad-8ddaf82bed9a',
  'https://www.gsh.co.za/',
  'Groote Schuur Hospital | World Famous and World Class',
  'Groote Schuur Hospital',
  'official'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'ccdec93c-5833-e75f-eae6-ecd2ff0e2e4e',
  'https://www.property24.com/houses-to-rent/durbanville/western-cape/439',
  'Houses to rent in Durbanville : Durbanville Property : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '9313fa3f-e2b6-7d1b-2c53-f7260980d8e4',
  'https://www.property24.com/to-rent/amanda-glen/durbanville/western-cape/9515/116100751',
  '1 Bedroom Townhouse to rent in Amanda Glen - 1 Patou Avenue - P24-116100751',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '52645dde-10f2-4304-ef66-cacd7e30663b',
  'https://www.property24.com/to-rent/bellville-central/bellville/western-cape/9426/115961066',
  '1 Bedroom Apartment / flat to rent in Bellville Central - P24-115961066',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '02523971-ef95-0c2c-4cb6-05c9bf607214',
  'https://www.property24.com/to-rent/century-city/milnerton/western-cape/8027',
  'Century City Property : Property and houses to rent in Century City : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'f0057c96-90b1-be43-160f-7cef75ddf29e',
  'https://www.property24.com/to-rent/century-city/milnerton/western-cape/8027/115608137',
  '1 Bedroom Apartment / flat to rent in Century City - P24-115608137',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '684fac83-8978-9c85-74fc-f74500667de9',
  'https://www.property24.com/to-rent/claremont/cape-town/western-cape/11741',
  'Claremont, Cape Town Property : Property and houses to rent in Claremont, Cape Town : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '45c8d127-2945-7144-7e29-1ebb60ce6cfe',
  'https://www.property24.com/to-rent/claremont/cape-town/western-cape/11741/115448770',
  '4 Bedroom Townhouse to rent in Claremont - 5 Midwood Ave - P24-115448770',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '451fd9d5-6974-7a88-a078-a068d494b353',
  'https://www.property24.com/to-rent/claremont/cape-town/western-cape/11741/116107540',
  '3 Bedroom House to rent in Claremont - P24-116107540',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'ec483c61-9872-7a36-49f4-abaa2c72aed3',
  'https://www.property24.com/to-rent/newlands/cape-town/western-cape/8679',
  'Newlands, Cape Town Property : Property and houses to rent in Newlands, Cape Town : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'cf5c19cb-7601-00f7-ddca-4bf26b63eb6f',
  'https://www.property24.com/to-rent/newlands/cape-town/western-cape/8679/115215867',
  '3 Bedroom House to rent in Newlands - 19 Van Reenen Close - P24-115215867',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '0261797f-2db4-be3d-a133-bcd08709af61',
  'https://www.property24.com/to-rent/newlands/cape-town/western-cape/8679/115518459',
  '2 Bedroom House to rent in Newlands - P24-115518459',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '73cebd66-4419-0f48-0895-05b4a7937d6b',
  'https://www.property24.com/to-rent/observatory/cape-town/western-cape/10157',
  'Observatory, Cape Town Property : Property and houses to rent in Observatory, Cape Town : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'dfc28a12-4046-0f4d-ec23-a8243e0fc77e',
  'https://www.property24.com/to-rent/observatory/cape-town/western-cape/10157/116195515',
  '2 Bedroom House to rent in Observatory - P24-116195515',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '5d48f714-fd4b-43a1-5453-3e822a9dbd88',
  'https://www.property24.com/to-rent/observatory/cape-town/western-cape/10157/116320282',
  '2 Bedroom Apartment / flat to rent in Observatory - P24-116320282',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '3adaf440-f31b-070d-1e76-169f2ab0013a',
  'https://www.property24.com/to-rent/oude-westhof/bellville/western-cape/9498/114407425',
  '3 Bedroom Townhouse to Rent in Oude Westhof - 33,35 & 37 Blanc De Noir, 1 Bukettraube Close - P24-114407425',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'aadbdd25-a1d4-b1b2-874e-b6ec4e66abcd',
  'https://www.property24.com/to-rent/rondebosch/cape-town/western-cape/8682',
  'Rondebosch Property : Property and houses to rent in Rondebosch : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '0fe67089-4b58-99bd-4000-94ecc4312b89',
  'https://www.property24.com/to-rent/rondebosch/cape-town/western-cape/8682/111716359',
  '4 Bedroom House to rent in Rondebosch - P24-111716359',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '84d04ae4-def1-554e-4566-13d4e372d258',
  'https://www.property24.com/to-rent/rondebosch/cape-town/western-cape/8682/116256882',
  '3 Bedroom Townhouse to rent in Rondebosch - 54 Park Road - P24-116256882',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'b9ce76e9-a196-f14a-11a4-660957ba7262',
  'https://www.property24.com/to-rent/sea-point/cape-town/western-cape/11021',
  'Sea Point Property : Property and houses to rent in Sea Point : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '80c0b2dd-fca4-a22d-b0f6-f5bf0de70597',
  'https://www.property24.com/to-rent/table-view/blouberg/western-cape/11589',
  'Table View Property : Property and houses to rent in Table View : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '417a7b07-db6d-886a-d71b-4260a0bdf9b7',
  'https://www.property24.com/to-rent/table-view/blouberg/western-cape/11589/p3',
  'Table View Property : Property and houses to rent in Table View : Property24.com - Page 3',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'e9e7cf77-ab4e-6ea4-79df-f056bca8576b',
  'https://www.property24.com/to-rent/table-view/blouberg/western-cape/11589/p5',
  'Table View Property : Property and houses to rent in Table View : Property24.com - Page 5',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'b72d7aba-dc51-2c9d-a68a-e8030011a8da',
  'https://www.property24.com/to-rent/woodstock/cape-town/western-cape/10164/110134910',
  '2 Bedroom House to rent in Woodstock - 11 Melbourne Road - P24-110134910',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '16f80f66-17d6-4d7b-ca70-797f216d6d2d',
  'https://www.property24.com/to-rent/woodstock/cape-town/western-cape/10164/115835774',
  '2 Bedroom Apartment / flat to rent in Woodstock - 1 Upper East Side, 31 Brickfield - P24-115835774',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '499568ab-931c-0e2e-8bae-83ea43d08d13',
  'https://www.property24.com/to-rent/woodstock/cape-town/western-cape/10164/116124832',
  '1 Bedroom Apartment / flat to rent in Woodstock - 4 Bromwell Street - P24-116124832',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '208e6c88-2e81-cec5-416d-55cbd74274ca',
  'https://www.property24.com/townhouses-to-rent/bellville/western-cape/441',
  'Townhouses to rent in Bellville : Bellville Property : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '854ec721-aae8-43ba-9d26-17e3152eecfb',
  'https://www.property24.com/townhouses-to-rent/century-city/milnerton/western-cape/8027',
  'Century City Property : Townhouses to rent in Century City : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '6d86f913-63b0-404f-26c9-75a7ab5a0977',
  'https://www.property24.com/townhouses-to-rent/durbanville/western-cape/439',
  'Townhouses to rent in Durbanville : Durbanville Property : Property24.com',
  'Property24',
  'property_portal'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'e6c0a60d-2007-1549-64c2-1bac3015a3ce',
  'https://www.sanbi.org/contact/',
  'Contact - SANBI',
  'SANBI',
  'official'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'd0329041-91b0-fd88-d07e-a409947236f0',
  'https://www.uct.ac.za/contacts-maps/directions-uct',
  'Directions to UCT | University of Cape Town',
  'University of Cape Town',
  'official'::public.research_source_type,
  null,
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
)
on conflict (url) do update
set
  title = excluded.title,
  publisher = excluded.publisher,
  source_type = excluded.source_type,
  date_published = excluded.date_published,
  date_accessed = excluded.date_accessed,
  metadata = public.research_sources.metadata || excluded.metadata;

insert into public.suburb_profiles (
  suburb_id,
  access_date,
  short_summary,
  standout_feature,
  standout_source_id,
  metadata
)
values
(
  '22222222-2222-2222-2222-222222222222',
  date '2026-03-16',
  'Cape Town Tourism describes Claremont as a vibrant Southern Suburbs neighbourhood with diverse communities and plenty to see and do.',
  'Cavendish Square is a major retail anchor in the heart of Claremont.',
  '8590aab3-6abf-3f98-fbaa-0a2a4c95548c',
  '{"listing_page_note":"Property24 search result showed 231 rental listings in Claremont at access time.","data_gaps":["No suburb-level transport distance pack has been compiled yet.","Residential samples are direct listings, not normalized rent bands."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '70b49d94-abd3-0856-dc87-3ef946b78b46',
  date '2026-03-16',
  'Cape Town Tourism describes Observatory as a creative, bohemian neighbourhood with thrift stores, cafes, bars, and a laid-back local identity.',
  'Groote Schuur Hospital is located in Observatory.',
  'f2cd9478-bc18-0842-d8ad-8ddaf82bed9a',
  '{"listing_page_note":"Property24 search result showed 297 rental listings in Observatory at access time.","data_gaps":["Transport values still need direct map-based verification.","Some Observatory listings are house-share stock and should be excluded from future rent-band modeling."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '985c32e4-396e-9819-8aaa-d83253a7bfc4',
  date '2026-03-16',
  'Cape Town Tourism says Table View is named after its views of Table Mountain and positions it as a suburban neighbourhood close to the western seaboard beach lifestyle.',
  'Table View is named after its views of Table Mountain.',
  '87fb8e74-b456-007a-ac5d-fbb671022612',
  '{"listing_page_note":"Property24 search result showed 114 rental listings in Table View at access time.","data_gaps":["No verified suburb-specific commute set has been added yet.","Beachfront and inland Table View stock should be split later because pricing differs."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '6ff666ec-9ddf-3d14-f493-035f196ea1d1',
  date '2026-03-16',
  'Cape Town Tourism describes Bellville as a residential, industrial, and commercial area in Cape Town''s Northern Suburbs with access to shopping and family attractions.',
  'Tyger Valley Shopping Centre has over 275 retail offerings.',
  '552f3246-6c40-fbfe-cd92-b3074776671f',
  '{"listing_page_note":"Property24 search result showed 1,014 rental listings across Bellville and its sub-areas at access time.","data_gaps":["Bellville results span multiple sub-areas; later migration should normalize by sub-area where needed.","Residential samples here are broad Bellville market observations, not a single micro-node."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'c76b6e04-3306-5577-7812-e49d6602d2c4',
  date '2026-03-16',
  'UCT states that its Groote Schuur Campus is situated in the suburb of Rondebosch, giving the area a strong education anchor.',
  'UCT''s Groote Schuur Campus is situated in Rondebosch.',
  'd0329041-91b0-fd88-d07e-a409947236f0',
  '{"listing_page_note":"Direct overall residential count was not captured cleanly from Property24; sample listings below are source-backed.","data_gaps":["Need a cleaner full-category rental count capture.","Student-oriented room-share stock near UCT needs separate treatment from standard household rentals."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
  date '2026-03-16',
  'Cape Town Tourism positions Sea Point as an Atlantic Seaboard neighbourhood between Signal Hill and the ocean, anchored by the promenade and a strong apartment market.',
  'The Sea Point Promenade stretches along the shoreline into Mouille Point past Green Point.',
  '8b323179-ba15-d277-8da1-2b6ca1cd0e3a',
  '{"listing_page_note":"Property24 search result showed 297 rental listings in Sea Point at access time.","data_gaps":["A number of Sea Point listings are furnished or short-term biased and should be flagged during migration.","Future migration should split studio and one-bed apartment stock cleanly."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'df9651e6-ed98-c46c-14cf-38c0a5d07435',
  date '2026-03-16',
  'Cape Town Tourism describes Woodstock as one of Cape Town''s oldest suburbs and a creative hub with food, design, and street art.',
  'The Old Biscuit Mill at 373-375 Albert Road is a major Woodstock drawcard.',
  '595f5aa0-7ff7-ec8d-c53d-6bc588f636f2',
  '{"listing_page_note":"A clean total residential count was not captured from the Woodstock category page because Property24 search results were pagination-biased.","data_gaps":["House-share and student-leaning Woodstock stock needs separate treatment from standard household rentals.","The Woodstock search result set needs one cleaner category scrape in the migration phase."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '00d90a9b-494b-c150-5634-f84c13fc6bf6',
  date '2026-03-16',
  'The official Century City precinct page describes the area as a 250-hectare mixed-use business and lifestyle precinct halfway between the Cape Town CBD and the northern suburbs.',
  'Century City is a 250ha mixed-use precinct halfway between the Cape Town CBD and the northern suburbs.',
  '89b5387c-c9c2-2158-1ccb-e98862b48817',
  '{"listing_page_note":"Property24 search result showed 548 rental listings in Century City at access time.","data_gaps":["Century City includes a high share of furnished and short-stay stock, so long-term migration rules need extra filtering.","Residential stock should later be separated by estate or development where possible."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
  date '2026-03-16',
  'Cape Town Tourism describes Durbanville as a Cape Town winelands town with outdoor recreation and access to nearby wineries.',
  'Durbanville Wine Valley is positioned as a key local drawcard and is described as a short drive from Cape Town.',
  'bcaa351e-bd36-4ee8-c180-d75194b57c73',
  '{"listing_page_note":"Property24 search result showed 51 houses, 28 apartments, and 18 townhouses to rent in Durbanville at access time.","data_gaps":["Durbanville samples span multiple sub-areas such as Amanda Glen, Vierlanden, and Durbanville Central.","Migration should likely treat Durbanville micro-areas separately if suburb-level precision is required."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
  date '2026-03-16',
  'Cape Town Tourism describes Newlands as a leafy Southern Suburbs neighbourhood known for nature, sport, and mountain access.',
  'Kirstenbosch National Botanical Garden is located on Rhodes Drive in Newlands.',
  'e6c0a60d-2007-1549-64c2-1bac3015a3ce',
  '{"listing_page_note":"A clean overall residential count was not captured from the Newlands category page, but multiple current listing samples were verified.","data_gaps":["Newlands stock includes premium furnished and short-lease options that should be tagged during migration.","A full category count for Newlands residential listings still needs one clean capture."],"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
)
on conflict (suburb_id) do update
set
  access_date = excluded.access_date,
  short_summary = excluded.short_summary,
  standout_feature = excluded.standout_feature,
  standout_source_id = excluded.standout_source_id,
  metadata = excluded.metadata;

insert into public.suburb_features (
  id,
  suburb_id,
  feature_type,
  fact,
  source_id,
  access_date,
  metadata
)
values
(
  'c5364554-60a4-84eb-d206-94c731e4e7fa',
  '22222222-2222-2222-2222-222222222222',
  'standout',
  'Cavendish Square is a major retail anchor in the heart of Claremont.',
  '8590aab3-6abf-3f98-fbaa-0a2a4c95548c',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'f7977f43-358e-db98-b235-9063b6960a38',
  '70b49d94-abd3-0856-dc87-3ef946b78b46',
  'standout',
  'Groote Schuur Hospital is located in Observatory.',
  'f2cd9478-bc18-0842-d8ad-8ddaf82bed9a',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'b7aed06a-3a4e-35c1-affa-56c2f5c659f9',
  '985c32e4-396e-9819-8aaa-d83253a7bfc4',
  'standout',
  'Table View is named after its views of Table Mountain.',
  '87fb8e74-b456-007a-ac5d-fbb671022612',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '8c3a41b1-53f9-f076-56e5-8d6d41e058ff',
  '6ff666ec-9ddf-3d14-f493-035f196ea1d1',
  'standout',
  'Tyger Valley Shopping Centre has over 275 retail offerings.',
  '552f3246-6c40-fbfe-cd92-b3074776671f',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'cdc79411-af5c-dda3-5d79-d008813c136c',
  'c76b6e04-3306-5577-7812-e49d6602d2c4',
  'standout',
  'UCT''s Groote Schuur Campus is situated in Rondebosch.',
  'd0329041-91b0-fd88-d07e-a409947236f0',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '39650b5b-0ad2-fda8-fc85-2d73991ceaa1',
  'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
  'standout',
  'The Sea Point Promenade stretches along the shoreline into Mouille Point past Green Point.',
  '8b323179-ba15-d277-8da1-2b6ca1cd0e3a',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '2960ffd8-24ab-0620-f15c-7ea874db0ee3',
  'df9651e6-ed98-c46c-14cf-38c0a5d07435',
  'standout',
  'The Old Biscuit Mill at 373-375 Albert Road is a major Woodstock drawcard.',
  '595f5aa0-7ff7-ec8d-c53d-6bc588f636f2',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '1fc82065-41e7-499d-eae3-0fc5c724df49',
  '00d90a9b-494b-c150-5634-f84c13fc6bf6',
  'standout',
  'Century City is a 250ha mixed-use precinct halfway between the Cape Town CBD and the northern suburbs.',
  '89b5387c-c9c2-2158-1ccb-e98862b48817',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'cee6a596-cada-670b-d206-60170db7df3e',
  '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
  'standout',
  'Durbanville Wine Valley is positioned as a key local drawcard and is described as a short drive from Cape Town.',
  'bcaa351e-bd36-4ee8-c180-d75194b57c73',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'abefc268-ab89-7b65-50dd-83827499149b',
  'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
  'standout',
  'Kirstenbosch National Botanical Garden is located on Rhodes Drive in Newlands.',
  'e6c0a60d-2007-1549-64c2-1bac3015a3ce',
  date '2026-03-16',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
)
on conflict on constraint suburb_features_unique do update
set
  source_id = excluded.source_id,
  access_date = excluded.access_date,
  metadata = excluded.metadata;

insert into public.housing_listing_samples (
  id,
  suburb_id,
  source_id,
  access_date,
  property_type,
  bedrooms,
  parking_spaces,
  monthly_rent_zar,
  listing_title,
  notes,
  metadata
)
values
(
  '75f2752f-1373-4416-ff35-8ee5dc904c5b',
  '22222222-2222-2222-2222-222222222222',
  '684fac83-8978-9c85-74fc-f74500667de9',
  date '2026-03-16',
  'apartment'::public.property_type,
  2,
  null,
  19500.00,
  'Claremont, Cape Town Property : Property and houses to rent in Claremont, Cape Town : Property24.com',
  'The Claremont, 53 Main Road; 81 m2; 2 bathrooms; 2 parking bays.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '5b6ec1e7-4e68-7931-daa8-0ce00c6a6805',
  '22222222-2222-2222-2222-222222222222',
  '451fd9d5-6974-7a88-a078-a068d494b353',
  date '2026-03-16',
  'house'::public.property_type,
  3,
  null,
  18000.00,
  '3 Bedroom House to rent in Claremont - P24-116107540',
  'Unfurnished 3-bedroom house in Claremont.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '21536eff-1710-bfbe-871e-ae4419b795bb',
  '22222222-2222-2222-2222-222222222222',
  '45c8d127-2945-7144-7e29-1ebb60ce6cfe',
  date '2026-03-16',
  'townhouse'::public.property_type,
  4,
  null,
  40000.00,
  '4 Bedroom Townhouse to rent in Claremont - 5 Midwood Ave - P24-115448770',
  '5 Midwood Ave; Midwood Mews townhouse; 165 m2.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '73ac27dc-f42d-ef17-d20a-d2ceaea67ef8',
  '70b49d94-abd3-0856-dc87-3ef946b78b46',
  '73cebd66-4419-0f48-0895-05b4a7937d6b',
  date '2026-03-16',
  'apartment'::public.property_type,
  1,
  null,
  12500.00,
  'Observatory, Cape Town Property : Property and houses to rent in Observatory, Cape Town : Property24.com',
  '1-bedroom apartment in Observatory; 40 m2; 1 parking bay.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '657165e4-53d9-6e63-8356-88d518bb8cc5',
  '70b49d94-abd3-0856-dc87-3ef946b78b46',
  '5d48f714-fd4b-43a1-5453-3e822a9dbd88',
  date '2026-03-16',
  'apartment'::public.property_type,
  2,
  null,
  10100.00,
  '2 Bedroom Apartment / flat to rent in Observatory - P24-116320282',
  'Malta Park apartment; 1 bathroom; 1 garage.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'ce9cbbde-3530-0927-9848-4415d9ea41ee',
  '70b49d94-abd3-0856-dc87-3ef946b78b46',
  'dfc28a12-4046-0f4d-ec23-a8243e0fc77e',
  date '2026-03-16',
  'house'::public.property_type,
  2,
  null,
  18000.00,
  '2 Bedroom House to rent in Observatory - P24-116195515',
  '2-bedroom house in Observatory; 1 bathroom; 1 garage.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '09956176-4d1a-380c-4b5b-c3cc61f6437b',
  '985c32e4-396e-9819-8aaa-d83253a7bfc4',
  '417a7b07-db6d-886a-d71b-4260a0bdf9b7',
  date '2026-03-16',
  'apartment'::public.property_type,
  1,
  null,
  9500.00,
  'Table View Property : Property and houses to rent in Table View : Property24.com - Page 3',
  'Studio-style 1-bedroom unit in Table View; 24 m2; furnished.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '80ce4c8c-e3fe-8d20-abfd-e41edb0bcb62',
  '985c32e4-396e-9819-8aaa-d83253a7bfc4',
  'e9e7cf77-ab4e-6ea4-79df-f056bca8576b',
  date '2026-03-16',
  'apartment'::public.property_type,
  2,
  null,
  13500.00,
  'Table View Property : Property and houses to rent in Table View : Property24.com - Page 5',
  '2-bedroom apartment sample from Table View category results.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '0582a36b-c25b-a470-ac07-3582f7aac5e7',
  '985c32e4-396e-9819-8aaa-d83253a7bfc4',
  '80c0b2dd-fca4-a22d-b0f6-f5bf0de70597',
  date '2026-03-16',
  'house'::public.property_type,
  3,
  null,
  22000.00,
  'Table View Property : Property and houses to rent in Table View : Property24.com',
  '47 Jansens Avenue; 3-bedroom house; 936 m2 erf.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '2a333ab7-2a30-d5b6-72ed-1b5368d74cf3',
  '6ff666ec-9ddf-3d14-f493-035f196ea1d1',
  '52645dde-10f2-4304-ef66-cacd7e30663b',
  date '2026-03-16',
  'apartment'::public.property_type,
  1,
  null,
  5850.00,
  '1 Bedroom Apartment / flat to rent in Bellville Central - P24-115961066',
  'Bellville Central bachelor flat; water, sewerage, and refuse included.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '8d8e79f1-b795-b83f-2a8c-53c8fc15a5d5',
  '6ff666ec-9ddf-3d14-f493-035f196ea1d1',
  '208e6c88-2e81-cec5-416d-55cbd74274ca',
  date '2026-03-16',
  'townhouse'::public.property_type,
  2,
  null,
  14500.00,
  'Townhouses to rent in Bellville : Bellville Property : Property24.com',
  '2-bedroom townhouse in Kenridge.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '76b0d511-071a-e719-aaa3-b1e7bd45e9a8',
  '6ff666ec-9ddf-3d14-f493-035f196ea1d1',
  '3adaf440-f31b-070d-1e76-169f2ab0013a',
  date '2026-03-16',
  'townhouse'::public.property_type,
  3,
  null,
  13500.00,
  '3 Bedroom Townhouse to Rent in Oude Westhof - 33,35 & 37 Blanc De Noir, 1 Bukettraube Close - P24-114407425',
  '3-bedroom townhouse in Oude Westhof; 127 m2 floor area.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'b07a1451-e298-2ed1-d68c-8ba3ab927a93',
  'c76b6e04-3306-5577-7812-e49d6602d2c4',
  'aadbdd25-a1d4-b1b2-874e-b6ec4e66abcd',
  date '2026-03-16',
  'apartment'::public.property_type,
  2,
  null,
  11000.00,
  'Rondebosch Property : Property and houses to rent in Rondebosch : Property24.com',
  '4 Firleigh Flats, 2a Bridge Street; 53 m2.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '975f8e20-9f56-6758-f206-6deba830b9aa',
  'c76b6e04-3306-5577-7812-e49d6602d2c4',
  '0fe67089-4b58-99bd-4000-94ecc4312b89',
  date '2026-03-16',
  'house'::public.property_type,
  4,
  null,
  28000.00,
  '4 Bedroom House to rent in Rondebosch - P24-111716359',
  '4-bedroom family home in Rondebosch; 537 m2 erf.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '36545e05-a912-75ee-61d5-48cc17579ac7',
  'c76b6e04-3306-5577-7812-e49d6602d2c4',
  '84d04ae4-def1-554e-4566-13d4e372d258',
  date '2026-03-16',
  'townhouse'::public.property_type,
  3,
  null,
  55000.00,
  '3 Bedroom Townhouse to rent in Rondebosch - 54 Park Road - P24-116256882',
  '54 Park Road; Rondebosch Oval security development; 240 m2 floor area.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '9aac7301-4f0d-e940-2f7e-bc5b8cb0b716',
  'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
  'b9ce76e9-a196-f14a-11a4-660957ba7262',
  date '2026-03-16',
  'apartment'::public.property_type,
  0,
  null,
  14500.00,
  'Sea Point Property : Property and houses to rent in Sea Point : Property24.com',
  '0.5-bedroom studio apartment at 7 Penarth Road; 35 m2.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '8524637b-5031-0c13-4cc4-0a431696e8b2',
  'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
  'b9ce76e9-a196-f14a-11a4-660957ba7262',
  date '2026-03-16',
  'apartment'::public.property_type,
  1,
  null,
  24000.00,
  'Sea Point Property : Property and houses to rent in Sea Point : Property24.com',
  '1-bedroom apartment at 259 On Beach; 77 m2.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'ee2750ee-8a96-a413-7121-4e62a3e01abc',
  'f0d4fbad-67e5-8cc0-8ce7-bfc2d99e71df',
  'b9ce76e9-a196-f14a-11a4-660957ba7262',
  date '2026-03-16',
  'house'::public.property_type,
  3,
  null,
  35000.00,
  'Sea Point Property : Property and houses to rent in Sea Point : Property24.com',
  '10a Rosedene Rd; semi-detached home; six-month lease note in source.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'fa78beb8-c8d3-b0c9-2f19-7b32884f8d21',
  'df9651e6-ed98-c46c-14cf-38c0a5d07435',
  '499568ab-931c-0e2e-8bae-83ea43d08d13',
  date '2026-03-16',
  'apartment'::public.property_type,
  1,
  null,
  10950.00,
  '1 Bedroom Apartment / flat to rent in Woodstock - 4 Bromwell Street - P24-116124832',
  '4 Bromwell Street; 38 m2 bachelor-style apartment.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'e632d67d-2a21-c92a-f687-60c82cb2d8bb',
  'df9651e6-ed98-c46c-14cf-38c0a5d07435',
  '16f80f66-17d6-4d7b-ca70-797f216d6d2d',
  date '2026-03-16',
  'apartment'::public.property_type,
  2,
  null,
  17500.00,
  '2 Bedroom Apartment / flat to rent in Woodstock - 1 Upper East Side, 31 Brickfield - P24-115835774',
  'Upper East Side; 84 m2; 2 parking bays.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '4b6f8a1f-de8d-3b4c-a017-ca8718cd4aeb',
  'df9651e6-ed98-c46c-14cf-38c0a5d07435',
  'b72d7aba-dc51-2c9d-a68a-e8030011a8da',
  date '2026-03-16',
  'house'::public.property_type,
  2,
  null,
  21000.00,
  '2 Bedroom House to rent in Woodstock - 11 Melbourne Road - P24-110134910',
  '11 Melbourne Road; renovated Victorian cottage.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'd56294ef-3448-efb7-6135-5ea004995095',
  '00d90a9b-494b-c150-5634-f84c13fc6bf6',
  'f0057c96-90b1-be43-160f-7cef75ddf29e',
  date '2026-03-16',
  'apartment'::public.property_type,
  1,
  null,
  17000.00,
  '1 Bedroom Apartment / flat to rent in Century City - P24-115608137',
  'Fully furnished loft apartment in Century City; 70 m2; short fixed lease.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '4d54f2ae-136f-e621-459e-6b2e8137f7db',
  '00d90a9b-494b-c150-5634-f84c13fc6bf6',
  '02523971-ef95-0c2c-4cb6-05c9bf607214',
  date '2026-03-16',
  'apartment'::public.property_type,
  2,
  null,
  20000.00,
  'Century City Property : Property and houses to rent in Century City : Property24.com',
  '2-bedroom apartment sample from Property24 Century City category results; 80 m2.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'e820f8af-cef7-26c5-f01c-1fd7ed930008',
  '00d90a9b-494b-c150-5634-f84c13fc6bf6',
  '854ec721-aae8-43ba-9d26-17e3152eecfb',
  date '2026-03-16',
  'townhouse'::public.property_type,
  3,
  null,
  29000.00,
  'Century City Property : Townhouses to rent in Century City : Property24.com',
  '3-bedroom townhouse sample from Century City townhouse category.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '1220039e-f3aa-93b9-21c5-afd629803f11',
  '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
  '9313fa3f-e2b6-7d1b-2c53-f7260980d8e4',
  date '2026-03-16',
  'townhouse'::public.property_type,
  1,
  null,
  13500.00,
  '1 Bedroom Townhouse to rent in Amanda Glen - 1 Patou Avenue - P24-116100751',
  'Amanda Glen; 73 m2; secure Bergsig Garden Village complex.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'abdb5813-7975-6aa4-91dc-da93904690dd',
  '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
  'ccdec93c-5833-e75f-eae6-ecd2ff0e2e4e',
  date '2026-03-16',
  'house'::public.property_type,
  2,
  null,
  15500.00,
  'Houses to rent in Durbanville : Durbanville Property : Property24.com',
  'Durbanville Central 2-bedroom house sample from houses category.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '4647d7bb-1265-4aed-ab85-364caf04ac03',
  '366b3ba4-cc06-99a5-b3e1-c917429f6ba4',
  '6d86f913-63b0-404f-26c9-75a7ab5a0977',
  date '2026-03-16',
  'townhouse'::public.property_type,
  3,
  null,
  24950.00,
  'Townhouses to rent in Durbanville : Durbanville Property : Property24.com',
  'Vierlanden townhouse sample from Durbanville townhouse category.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '72b216ff-5bcb-d18b-b658-adfbc96b944f',
  'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
  'ec483c61-9872-7a36-49f4-abaa2c72aed3',
  date '2026-03-16',
  'apartment'::public.property_type,
  2,
  null,
  24000.00,
  'Newlands, Cape Town Property : Property and houses to rent in Newlands, Cape Town : Property24.com',
  '135 Campground Rd apartment sample from Newlands category results; 100 m2.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  'c12af019-ee35-e8f2-96c6-be9a6dff123e',
  'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
  '0261797f-2db4-be3d-a133-bcd08709af61',
  date '2026-03-16',
  'house'::public.property_type,
  2,
  null,
  35000.00,
  '2 Bedroom House to rent in Newlands - P24-115518459',
  'Fully furnished home on shared property in Newlands.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
),
(
  '8e685a5f-cc23-bd88-39ba-9aeb48410217',
  'bf7804c8-6b28-f47d-6f44-e95e49bde03c',
  'cf5c19cb-7601-00f7-ddca-4bf26b63eb6f',
  date '2026-03-16',
  'house'::public.property_type,
  3,
  null,
  35000.00,
  '3 Bedroom House to rent in Newlands - 19 Van Reenen Close - P24-115215867',
  '19 Van Reenen Close; estate-style Newlands home with fibre and secure parking.',
  '{"research_batch":"cape-town-suburbs-research-2026-03-16"}'::jsonb
)
on conflict on constraint housing_listing_samples_unique do update
set
  access_date = excluded.access_date,
  property_type = excluded.property_type,
  bedrooms = excluded.bedrooms,
  parking_spaces = excluded.parking_spaces,
  monthly_rent_zar = excluded.monthly_rent_zar,
  notes = excluded.notes,
  metadata = excluded.metadata;

commit;
