import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const ACCESS_DATE = "2026-03-16";
const RESEARCH_BATCH = "cape-town-suburbs-research-2026-03-16";
const CLAREMONT_ID = "22222222-2222-2222-2222-222222222222";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const researchInputPath = resolve(
  rootDir,
  "research",
  "cape-town-suburbs-research-2026-03-16.json",
);
const stagingOutputPath = resolve(
  rootDir,
  "research",
  "cape-town-suburbs-supabase-staging.json",
);
const sqlOutputPath = resolve(rootDir, "supabase", "research_seed.sql");

function stableUuid(value) {
  const hash = createHash("md5").update(value).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function detectPublisher(url) {
  if (url.includes("property24.com")) {
    return "Property24";
  }
  if (url.includes("capetown.travel")) {
    return "Cape Town Tourism";
  }
  if (url.includes("uct.ac.za")) {
    return "University of Cape Town";
  }
  if (url.includes("sanbi.org")) {
    return "SANBI";
  }
  if (url.includes("gsh.co.za")) {
    return "Groote Schuur Hospital";
  }
  if (url.includes("cavendish.co.za")) {
    return "Cavendish Square";
  }
  if (url.includes("canalwalk.co.za")) {
    return "Canal Walk";
  }
  if (url.includes("theoldbiscuitmill.co.za")) {
    return "The Old Biscuit Mill";
  }
  if (url.includes("durbanvillewine.co.za")) {
    return "Durbanville Wine Valley";
  }
  return null;
}

function detectSourceType(url) {
  if (url.includes("property24.com")) {
    return "property_portal";
  }
  if (
    url.includes("uct.ac.za") ||
    url.includes("sanbi.org") ||
    url.includes("gsh.co.za") ||
    url.includes("cavendish.co.za") ||
    url.includes("canalwalk.co.za") ||
    url.includes("theoldbiscuitmill.co.za") ||
    url.includes("durbanvillewine.co.za")
  ) {
    return "official";
  }
  if (url.includes("capetown.travel")) {
    return "publisher";
  }
  return "other";
}

function sqlString(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  return `'${String(value).replaceAll("'", "''")}'`;
}

function sqlDate(value) {
  if (!value) {
    return "null";
  }
  return `date ${sqlString(value)}`;
}

function sqlNumeric(value) {
  if (value === null || value === undefined) {
    return "null";
  }
  return Number(value).toFixed(2);
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
}

function ensureDir(filePath) {
  mkdirSync(dirname(filePath), { recursive: true });
}

const research = JSON.parse(readFileSync(researchInputPath, "utf8"));

const suburbs = research.suburbs.map((suburb) => ({
  id:
    suburb.suburb_name === "Claremont"
      ? CLAREMONT_ID
      : stableUuid(`suburb:${suburb.suburb_name}`),
  name: suburb.suburb_name,
  slug: slugify(suburb.suburb_name),
  city: research.city,
  region_group: suburb.region_group,
  is_active: true,
  metadata: {
    country: research.country,
    summary: suburb.profile_summary,
    data_gaps: suburb.data_gaps,
    research_batch: RESEARCH_BATCH,
  },
}));

const sourcesByUrl = new Map();

function addSource(source) {
  if (!source?.url) {
    return null;
  }

  if (!sourcesByUrl.has(source.url)) {
    sourcesByUrl.set(source.url, {
      id: stableUuid(`source:${source.url}`),
      title: source.title,
      url: source.url,
      publisher: detectPublisher(source.url),
      source_type: detectSourceType(source.url),
      date_published: null,
      date_accessed: ACCESS_DATE,
      metadata: {
        research_batch: RESEARCH_BATCH,
      },
    });
  }

  return sourcesByUrl.get(source.url).id;
}

const suburbProfiles = research.suburbs.map((suburb) => {
  const suburbRow = suburbs.find((item) => item.name === suburb.suburb_name);
  const standoutSourceId = addSource(suburb.standout_feature_source);

  return {
    suburb_id: suburbRow.id,
    access_date: ACCESS_DATE,
    short_summary: suburb.profile_summary,
    standout_feature: suburb.standout_feature,
    standout_source_id: standoutSourceId,
    metadata: {
      listing_page_note: suburb.housing_snapshot.listing_page_note,
      data_gaps: suburb.data_gaps,
      research_batch: RESEARCH_BATCH,
    },
  };
});

const suburbFeatures = research.suburbs.map((suburb) => {
  const suburbRow = suburbs.find((item) => item.name === suburb.suburb_name);
  const sourceId = addSource(suburb.standout_feature_source);

  return {
    id: stableUuid(`feature:${suburb.suburb_name}:standout`),
    suburb_id: suburbRow.id,
    feature_type: "standout",
    fact: suburb.standout_feature,
    source_id: sourceId,
    access_date: ACCESS_DATE,
    metadata: {
      research_batch: RESEARCH_BATCH,
    },
  };
});

const housingListingSamples = [];

for (const suburb of research.suburbs) {
  const suburbRow = suburbs.find((item) => item.name === suburb.suburb_name);

  for (const listing of suburb.housing_snapshot.sample_listings) {
    const sourceId = addSource({
      title: listing.source_title,
      url: listing.source_url,
    });

    housingListingSamples.push({
      id: stableUuid(
        `listing:${suburb.suburb_name}:${listing.source_url}:${listing.monthly_rent_zar}`,
      ),
      suburb_id: suburbRow.id,
      source_id: sourceId,
      access_date: ACCESS_DATE,
      property_type: listing.property_type,
      bedrooms: listing.bedrooms,
      parking_spaces: null,
      monthly_rent_zar: listing.monthly_rent_zar,
      listing_title: listing.source_title,
      notes: listing.notes,
      metadata: {
        research_batch: RESEARCH_BATCH,
      },
    });
  }
}

const researchSources = Array.from(sourcesByUrl.values()).sort((a, b) =>
  a.url.localeCompare(b.url),
);

const staging = {
  generated_at: ACCESS_DATE,
  research_batch: RESEARCH_BATCH,
  suburbs,
  research_sources: researchSources,
  suburb_profiles: suburbProfiles,
  suburb_features: suburbFeatures,
  housing_listing_samples: housingListingSamples,
};

const suburbValues = suburbs
  .map(
    (row) => `(
  ${sqlString(row.id)},
  ${sqlString(row.name)},
  ${sqlString(row.slug)},
  ${sqlString(row.city)},
  ${sqlString(row.region_group)},
  ${row.is_active ? "true" : "false"},
  ${sqlJson(row.metadata)}
)`,
  )
  .join(",\n");

const sourceValues = researchSources
  .map(
    (row) => `(
  ${sqlString(row.id)},
  ${sqlString(row.url)},
  ${sqlString(row.title)},
  ${sqlString(row.publisher)},
  ${sqlString(row.source_type)}::public.research_source_type,
  ${sqlDate(row.date_published)},
  ${sqlDate(row.date_accessed)},
  ${sqlJson(row.metadata)}
)`,
  )
  .join(",\n");

const suburbProfileValues = suburbProfiles
  .map(
    (row) => `(
  ${sqlString(row.suburb_id)},
  ${sqlDate(row.access_date)},
  ${sqlString(row.short_summary)},
  ${sqlString(row.standout_feature)},
  ${sqlString(row.standout_source_id)},
  ${sqlJson(row.metadata)}
)`,
  )
  .join(",\n");

const suburbFeatureValues = suburbFeatures
  .map(
    (row) => `(
  ${sqlString(row.id)},
  ${sqlString(row.suburb_id)},
  ${sqlString(row.feature_type)},
  ${sqlString(row.fact)},
  ${sqlString(row.source_id)},
  ${sqlDate(row.access_date)},
  ${sqlJson(row.metadata)}
)`,
  )
  .join(",\n");

const housingValues = housingListingSamples
  .map(
    (row) => `(
  ${sqlString(row.id)},
  ${sqlString(row.suburb_id)},
  ${sqlString(row.source_id)},
  ${sqlDate(row.access_date)},
  ${sqlString(row.property_type)}::public.property_type,
  ${row.bedrooms},
  ${row.parking_spaces === null ? "null" : row.parking_spaces},
  ${sqlNumeric(row.monthly_rent_zar)},
  ${sqlString(row.listing_title)},
  ${sqlString(row.notes)},
  ${sqlJson(row.metadata)}
)`,
  )
  .join(",\n");

const sql = `begin;

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
${suburbValues}
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
${sourceValues}
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
${suburbProfileValues}
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
${suburbFeatureValues}
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
${housingValues}
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
`;

ensureDir(stagingOutputPath);
ensureDir(sqlOutputPath);

writeFileSync(stagingOutputPath, `${JSON.stringify(staging, null, 2)}\n`);
writeFileSync(sqlOutputPath, sql);

console.log(
  JSON.stringify(
    {
      suburbs: suburbs.length,
      sources: researchSources.length,
      suburb_profiles: suburbProfiles.length,
      suburb_features: suburbFeatures.length,
      housing_listing_samples: housingListingSamples.length,
      stagingOutputPath,
      sqlOutputPath,
    },
    null,
    2,
  ),
);
