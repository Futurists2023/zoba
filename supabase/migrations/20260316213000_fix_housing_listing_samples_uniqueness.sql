alter table public.housing_listing_samples
drop constraint if exists housing_listing_samples_unique;

alter table public.housing_listing_samples
add constraint housing_listing_samples_unique
unique (suburb_id, source_id, listing_title, monthly_rent_zar);
