# System Prompt

```txt
You are a Staff-level SEO, information architecture, product, and technical quality auditor. Be ruthless, independent, and decisive.
You are auditing a real Next.js codebase snapshot rather than a hypothetical architecture.
Use only the supplied evidence and treat missing route families or missing schema as explicit findings.
Be decisive, concrete, and implementation-oriented.
Return Markdown with clear sections that map to the required output schema.
Quote concrete routes, files, and behaviors from the provided context whenever they materially support a conclusion.
```

# User Prompt

```md
PROMPT CONFIG (swe_suburb_indexation_audit_prompt v1.0.0)
```json
{
  "name": "swe_suburb_indexation_audit_prompt",
  "version": "1.0.0",
  "purpose": "Machine-readable prompt for an SWE LLM to audit which suburb page families should be indexed, noindexed, merged, or deleted for a parent-first affordable schools platform scaling across South Africa.",
  "platform_context": {
    "mission": "Help parents find, shortlist, compare, and choose an affordable school in their area.",
    "current_indexable_page_families": [
      "/affordable-schools/[suburb]",
      "/affordable-primary-schools/[suburb]",
      "/affordable-high-schools/[suburb]"
    ],
    "scale_goal": "Approximately 3000 South African suburbs.",
    "non_goals": [
      "Generic directory behavior",
      "Prestige-first school discovery",
      "Thin pSEO pages",
      "Lifestyle filler content added only to bulk out pages"
    ]
  },
  "objective": "Study the existing codebase and built platform, score each suburb page family for indexability risk and utility, and produce a definitive architecture blueprint that keeps only pages that are genuinely useful to parents and defensible under Google scrutiny.",
  "policy_alignment": {
    "must_align_with": [
      "Google helpful, reliable, people-first content guidance",
      "Google spam policies including doorway abuse and scaled content abuse",
      "Google URL structure and crawl-efficiency best practices"
    ],
    "principles": [
      "Each indexed page must exist primarily to help parents, not to capture search traffic.",
      "Each indexed page must have a distinct user job and substantial value.",
      "Substantially similar suburb pages must not be allowed into the index.",
      "Broad hub pages should not be indexed unless they have unique utility beyond child pages.",
      "Filter and parameter expansion must not create crawl traps or near-duplicate pages."
    ]
  },
  "model_role": "You are a Staff-level SEO, information architecture, product, and technical quality auditor. Be ruthless, independent, and decisive.",
  "required_inputs": [
    "Route map",
    "Page templates",
    "Rendered examples of each page family",
    "Internal linking structure",
    "Metadata and canonical logic",
    "Schema markup",
    "Filter and query-parameter behavior",
    "School-card and comparison components",
    "Any indexation logic already present in the codebase"
  ],
  "audit_tasks": [
    {
      "id": "inventory_routes",
      "task": "Inventory every route and classify which are indexable, conditionally indexable, or non-indexable."
    },
    {
      "id": "compare_page_families",
      "task": "Compare /affordable-schools/[suburb], /affordable-primary-schools/[suburb], and /affordable-high-schools/[suburb] for overlap, distinct user job, and risk of substantial similarity."
    },
    {
      "id": "suburb_thresholds",
      "task": "Design hard thresholds that determine whether a suburb deserves 0, 1, 2, or 3 indexable pages."
    },
    {
      "id": "thin_page_detection",
      "task": "Detect signals of thin pages, empty pages, weak inventory pages, and pages with too little comparison utility."
    },
    {
      "id": "crawl_safety",
      "task": "Audit crawl traps, parameter sprawl, additive filters, canonicalization, and sitemap logic."
    },
    {
      "id": "parent_value",
      "task": "Test whether each page meaningfully helps a parent narrow down affordable school choices in a suburb."
    }
  ],
  "page_family_scoring_framework": {
    "score_range": "0-100",
    "dimensions": [
      {
        "name": "distinct_user_job",
        "weight": 20
      },
      {
        "name": "affordability_decision_value",
        "weight": 20
      },
      {
        "name": "inventory_depth",
        "weight": 15
      },
      {
        "name": "comparison_depth",
        "weight": 15
      },
      {
        "name": "template_uniqueness",
        "weight": 10
      },
      {
        "name": "internal_hierarchy_fit",
        "weight": 5
      },
      {
        "name": "thin_content_risk_inverse",
        "weight": 5
      },
      {
        "name": "doorway_risk_inverse",
        "weight": 5
      },
      {
        "name": "scaled_content_risk_inverse",
        "weight": 5
      }
    ],
    "classifications": [
      {
        "label": "index",
        "min_score": 80
      },
      {
        "label": "conditional_index",
        "min_score": 65
      },
      {
        "label": "noindex",
        "min_score": 45
      },
      {
        "label": "merge_or_delete",
        "min_score": 0
      }
    ]
  },
  "suburb_decision_rules": {
    "required_outputs_per_suburb": [
      "Whether /affordable-schools/[suburb] should be indexable",
      "Whether /affordable-primary-schools/[suburb] should be indexable",
      "Whether /affordable-high-schools/[suburb] should be indexable",
      "Whether any of the three should be merged, canonicalized, or removed",
      "What minimum data thresholds are missing if a page is not safe"
    ],
    "hard_questions": [
      "Does the broad suburb page do a unique job, or is it just a weaker version of the primary/high pages?",
      "Is the primary page genuinely distinct from the high-school page in content, inventory, and user job?",
      "Would a parent miss anything important if one of these pages did not exist?",
      "Does the page provide actionable comparison value or just a local list?",
      "Is this page one of many substantially similar pages differing only by suburb name or school stage?"
    ]
  },
  "required_output_schema": {
    "executive_verdict": {
      "fields": [
        "national_scale_safety",
        "defensibility_score",
        "top_risks",
        "top_strengths"
      ]
    },
    "route_family_decisions": {
      "fields": [
        "route_pattern",
        "purpose",
        "user_job",
        "unique_value",
        "overlap_with_siblings",
        "doorway_risk",
        "scaled_content_risk",
        "thin_content_risk",
        "default_action",
        "indexation_conditions",
        "merge_targets",
        "notes"
      ]
    },
    "suburb_threshold_model": {
      "fields": [
        "minimum_school_count",
        "minimum_stage_specific_count",
        "minimum_comparison_count",
        "minimum_unique_modules",
        "minimum_affordability_differentiation",
        "automatic_noindex_conditions",
        "automatic_merge_conditions"
      ]
    },
    "template_requirements": {
      "fields": [
        "page_type",
        "required_modules",
        "forbidden_patterns",
        "must_have_unique_data",
        "must_have_internal_links",
        "trust_labels",
        "notes"
      ]
    },
    "crawl_control_plan": {
      "fields": [
        "robots_rules",
        "canonical_rules",
        "sitemap_rules",
        "parameter_rules",
        "noindex_rules"
      ]
    },
    "implementation_plan": {
      "fields": [
        "phase",
        "priority",
        "task",
        "reason",
        "expected_seo_impact",
        "expected_product_impact",
        "complexity"
      ]
    },
    "launch_gate_checklist": {
      "fields": [
        "check",
        "pass_fail",
        "owner"
      ]
    }
  },
  "mandatory_instructions": [
    "Do not assume the broad suburb page deserves indexation by default.",
    "Do not recommend adding filler lifestyle text to make pages longer.",
    "If a page exists mainly to capture a keyword and not solve a distinct parent problem, recommend noindex, merge, or delete.",
    "If some suburbs should only have one or two indexable page types, define the exact rule.",
    "If the safest architecture is different from the current one, say so directly."
  ],
  "prompt_text": "You are a senior Staff-level SEO, information architecture, product, and technical quality auditor working inside an already-built platform. Your task is to study the current implementation in depth and produce the definitive architecture and improvement blueprint required to make this platform as defensible as possible against Google’s spam and low-quality-content systems while aligning with Google’s helpful-content guidance and spam policies.\n\nNon-negotiable platform intent: This platform exists to help parents find, shortlist, compare, and choose an affordable school in their area. It is not a generic directory, not a prestige publisher, and not a thin pSEO play. It must be parent-first, affordability-first, suburb-aware, and decision-support-oriented.\n\nCurrent reality you must audit: The platform currently has only these indexable page families: /affordable-schools/[suburb], /affordable-primary-schools/[suburb], and /affordable-high-schools/[suburb]. The long-term goal is to scale across approximately 3000 South African suburbs. That means the final architecture must remain defensible at very large scale and must not collapse into doorway pages, thin location pages, or substantially similar pSEO templates under Google scrutiny.\n\nCore strategic problem to solve: Determine whether this 3-template architecture is truly safe to scale, or whether parts of it should be merged, re-scoped, turned into hubs only, noindexed, indexed conditionally, or replaced with a stronger hierarchy. You must not assume that every suburb deserves all three indexable pages. You must determine the exact rules under which a page family is safe to index at national scale.\n\nRequired work: Audit route structure, templates, layout reuse, metadata, canonical tags, internal linking, school-card reuse, suburb-page reuse, comparison components, filter URLs, search parameters, thin states, empty states, schema markup, duplicate copy blocks, generated sections, and whether each page type has a real user job. Then produce a final report that includes: 1) executive verdict with defensibility score; 2) final decision for each page family; 3) hard indexation rules; 4) final URL and hierarchy blueprint; 5) template defensibility blueprint; 6) thin-page prevention system; 7) crawl-control system; 8) parent-value pass/fail framework; 9) implementation roadmap; 10) final launch gate checklist.\n\nImportant instructions: Be ruthless. Do not protect the current architecture if it is unsafe. Do not assume the broad suburb page deserves to be indexed. Do not recommend bulk lifestyle filler text just to make pages longer. If a page exists mainly to capture a keyword and not to solve a distinct parent problem, recommend noindex, merge, or deletion. If /affordable-schools/[suburb] is too similar to the primary/high pages, say so directly. If some suburbs should only have one or two indexable page types instead of three, define the exact rule.\n\nFinal standard: Your answer must read like the definitive internal architecture blueprint for a serious product team scaling a parent-first school platform nationally under Google scrutiny. The goal is not to rank more pages. The goal is to build a site whose indexed pages deserve to exist because they genuinely help parents choose affordable schools better than generic directories do.",
  "success_criteria": [
    "The report clearly decides which route families can scale safely.",
    "The report defines hard thresholds for index, conditional index, noindex, and merge/delete.",
    "The report gives a crawl-safe national architecture for 3000 suburbs.",
    "The report is implementation-ready for engineering and SEO teams.",
    "The report prioritizes parent utility over raw page count."
  ]
}
```

ROUTE INVENTORY
- / [page; redirect; redirect /affordable-schools/midrand; source app\page.tsx]
- /affordable-primary-schools/midrand [page; potentially indexable; canonical /affordable-primary-schools/midrand; source app\affordable-primary-schools\midrand\page.tsx]
- /affordable-schools/midrand [page; potentially indexable; canonical /affordable-schools/midrand; source app\affordable-schools\midrand\page.tsx]
- /affordable-schools/midrand/compare [page; non indexable; robots noindex,nofollow; source app\affordable-schools\midrand\compare\page.tsx]
- /affordable-schools/midrand/results [page; non indexable; robots noindex,nofollow; source app\affordable-schools\midrand\results\page.tsx]
- /affordable-schools/midrand/schools/[slug] [page; non indexable; robots noindex,nofollow; dynamic metadata; source app\affordable-schools\midrand\schools\[slug]\page.tsx]
- /affordable-schools/midrand/shortlist [page; non indexable; robots noindex,nofollow; source app\affordable-schools\midrand\shortlist\page.tsx]
- /api/affordable-schools/midrand/compare [api; non page asset; source app\api\affordable-schools\midrand\compare\route.ts]
- /api/affordable-schools/midrand/match [api; non page asset; source app\api\affordable-schools\midrand\match\route.ts]
- /api/affordable-schools/midrand/schools/[slug] [api; non page asset; source app\api\affordable-schools\midrand\schools\[slug]\route.ts]
- /api/claude [api; non page asset; source app\api\claude\route.ts]
- /sitemap.xml [metadata; non page asset; source app\sitemap.ts]
- /robots.txt [static asset; allow all; sitemap http://localhost:3000/sitemap.xml; source public/robots.txt]

EXPECTED PAGE FAMILY COVERAGE
- `/affordable-schools/[suburb]`: only prototyped as the static `/affordable-schools/midrand` route. There is no dynamic `[suburb]` segment or national-scale route implementation yet.
- `/affordable-primary-schools/[suburb]`: only prototyped as the static `/affordable-primary-schools/midrand` route. There is no dynamic `[suburb]` segment yet.
- `/affordable-high-schools/[suburb]`: absent from the app router, sitemap, and data model.

DATA COVERAGE SNAPSHOT
- Geographic coverage: 10 Midrand suburbs only.
- School inventory: 29 schools across the prototype catalog.
- Stage coverage: Grade R to Grade 7 only; there is no high-school inventory in the current seed model.
- School-type mix: private_mid_tier=10, public=9, private_low_fee=6, private_premium=4.
- Schools per suburb: Barbeque Downs=2, Blue Hills=3, Buccleuch=3, Carlswald=3, Glen Austin=3, Halfway Gardens=3, Kyalami=3, Noordwyk=3, Vorna Valley=3, Waterfall=3.
- Freshness marker: 2026-03-17T12:00:00.000Z.
- Trust/data label: the matching engine marks all records and reviews as simulated via `confidenceLevel: "simulated"` and `isSimulated: true`.

RENDERED SURFACE SNAPSHOT
- `/affordable-schools/midrand`: hero, Midrand guide copy, live filter panel, and live school-card results rendered through `LandingPage -> LiveDiscovery`.
- `/affordable-primary-schools/midrand`: the same `LandingPage -> LiveDiscovery` module stack with primary-specific hero and guide copy only.
- `/affordable-schools/midrand/results`: noindexed utility page that renders current filters plus the same `ResultsList` cards.
- `/affordable-schools/midrand/shortlist`: noindexed shortlist review with summary highlight cards and a comparison table.
- `/affordable-schools/midrand/schools/[slug]`: noindexed school detail with fee cards, quick facts, simulated reviews, and similar-school links.

METADATA AND CRAWL SIGNALS
- `app/layout.tsx` sets a global canonical and Open Graph URL to `/affordable-schools/midrand`, with layout-level robots set to index/follow true.
- `/affordable-schools/midrand` and `/affordable-primary-schools/midrand` each declare their own canonical URL and remain indexable by default.
- `/affordable-schools/midrand/results`, `/compare`, `/shortlist`, and `/schools/[slug]` all explicitly set `robots: { index: false, follow: false }`.
- `app/page.tsx` redirects `/` to `/affordable-schools/midrand`.
- `app/sitemap.ts` emits 0 concrete URLs: .
- `public/robots.txt` currently resolves to: User-agent: * | Allow: / |  | Sitemap: http://localhost:3000/sitemap.xml.
- `lib/site.ts` falls back to `http://localhost:3000` when `NEXT_PUBLIC_SITE_URL` is unset.
- The root layout hardcodes the hub canonical, so pages without a page-level canonical inherit a Midrand-biased default.

INTERNAL LINKING STRUCTURE
- `components/affordable-schools/live-discovery.tsx`: /api/affordable-schools/midrand/match
- `components/affordable-schools/results-list.tsx`: /affordable-schools/midrand/schools/${result.school.slug}?${filtersQuery}; /affordable-schools/midrand/shortlist?${params.toString()}
- `components/affordable-schools/search-wizard.tsx`: /affordable-schools/midrand/results?${query}
- No audited UX file links users from the broad Midrand page to the primary-leaf page, or vice versa; the two indexable pages are siblings without an in-product cross-link path.
- The shared school-card and detail flows always resolve into the `/affordable-schools/midrand/...` namespace, even when the user starts on `/affordable-primary-schools/midrand`.

FILTER AND PARAMETER BEHAVIOR
- Parsed filter keys: child_grade, budget_type, budget_value, home_suburb, work_suburb, max_commute, school_type, must_have_features, nice_to_have_features.
- Serialized filter keys: .
- `components/affordable-schools/live-discovery.tsx` refreshes matches with a POST request to `/api/affordable-schools/midrand/match`, so the indexable landing page does not expose live filter permutations as crawlable query URLs.
- `components/affordable-schools/results-list.tsx` appends a `schools` parameter when sending users into the noindexed shortlist flow.
- `components/affordable-schools/search-wizard.tsx` exists but is not imported elsewhere in the audited app snapshot, so the query-string results page appears to be a dormant utility flow rather than the primary landing experience.

TEMPLATE OVERLAP AND UNIQUENESS NOTES
- The broad and primary Midrand pages do not clearly share the same landing template.
- `LandingPage` always calls `matchSchools(getDefaultFilters())`, so both indexable pages hydrate the same default ranking payload before any user interaction.
- `LiveDiscovery` branches on the `variant` flag 0 times, and those branches are copy-level changes rather than different data, filters, or card modules.
- `ResultsList` routes detail and shortlist actions into the broad `/affordable-schools/midrand/...` subtree, which weakens the separateness of the primary-leaf page.
- The underlying catalog and engine model only Grade R to Grade 7 schools, so the broad suburb page is effectively serving primary-only inventory under a broader URL.

SCHEMA MARKUP NOTES
- No JSON-LD or schema-markup strings were found in the audited route, component, and library files.

IMPLEMENTATION NOTES
- The prototype is static to the `midrand` slug today; there is no `[suburb]` dynamic route or national route-generation layer yet.
- `matchSchools` scores budget, distance, must-haves, nice-to-haves, school-type preference, and ratings into one ranked list shared by both indexable templates.
- The matching layer reads from Supabase only when `SUPABASE_DB_URL` is configured, otherwise it serves the local Midrand seed dataset.
- School details, shortlist review, compare redirect, and results pages are explicitly utility flows rather than index targets.

CODEBASE CONTEXT
FILE: app\affordable-primary-schools\midrand\page.tsx
```tsx
﻿import type { Metadata } from "next";

import { LandingPage } from "@/components/affordable-schools/landing-page";

export const metadata: Metadata = {
  title: "Affordable primary schools in Midrand",
  description:
    "Browse the Midrand primary-school leaf page for affordability-first shortlisting built on simulated school data.",
  alternates: {
    canonical: "/affordable-primary-schools/midrand",
  },
};

export default function AffordablePrimarySchoolsMidrandPage() {
  return <LandingPage variant="primary" />;
}


```

FILE: app\affordable-schools\midrand\compare\page.tsx
```tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Shortlist redirect",
  description: "Redirects compare links to the shortlist review page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AffordableSchoolsComparePage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) {
          params.append(key, item);
        }
      });
    } else if (value) {
      params.set(key, value);
    }
  }

  redirect(
    `/affordable-schools/midrand/shortlist${
      params.size > 0 ? `?${params.toString()}` : ""
    }`,
  );
}

```

FILE: app\affordable-schools\midrand\page.tsx
```tsx
﻿import type { Metadata } from "next";

import { LandingPage } from "@/components/affordable-schools/landing-page";

export const metadata: Metadata = {
  title: "Affordable schools in Midrand",
  description:
    "AffordableSchools helps Midrand families shortlist affordable schools using simulated budget, commute, and feature matching.",
  alternates: {
    canonical: "/affordable-schools/midrand",
  },
};

export default function AffordableSchoolsMidrandPage() {
  return <LandingPage variant="hub" />;
}


```

FILE: app\affordable-schools\midrand\results\page.tsx
```tsx
﻿import type { Metadata } from "next";

import { ResultsList } from "@/components/affordable-schools/results-list";
import { formatCurrency, matchSchools } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Live Midrand school results",
  description:
    "Live Midrand school results using sample data while verified coverage is being prepared.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AffordableSchoolsResultsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFiltersFromSearchParams(resolvedSearchParams);
  const payload = await matchSchools(filters);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[2rem] border border-ink/10 bg-white/75 p-6 shadow-[0_20px_70px_rgba(24,34,47,0.1)] backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">Non-indexed utility page</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
          Live Midrand matches for your current filters
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          This screen updates the same sample-data match model used on the main mobile discovery experience. Current annual budget target: {formatCurrency(payload.annualBudget)}.
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[1.8rem] border border-ink/10 bg-white/80 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)] h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Current setup</p>
          <dl className="mt-4 grid gap-4 text-sm text-ink-soft">
            <div>
              <dt className="font-semibold text-ink">Child grade</dt>
              <dd>{filters.childGrade}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Home suburb</dt>
              <dd>{filters.homeSuburb}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Commute</dt>
              <dd>{filters.maxCommute.replaceAll("_", " ")}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Must-haves</dt>
              <dd>{filters.mustHaveFeatures.join(", ") || "None selected"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Nice-to-haves</dt>
              <dd>{filters.niceToHaveFeatures.join(", ") || "None selected"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Source</dt>
              <dd>{payload.source}</dd>
            </div>
          </dl>
        </aside>

        <ResultsList filters={filters} results={payload.matches} />
      </section>
    </main>
  );
}


```

FILE: app\affordable-schools\midrand\schools\[slug]\page.tsx
```tsx
﻿import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatCurrency, getSchoolDetail, getSchoolTypeLabel, getSuburbName } from "@/lib/affordable-schools/engine";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getSchoolDetail(slug);

  if (!detail) {
    return {
      title: "School not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${detail.school.name} fees and reviews`,
    description: `Simulated detail page for ${detail.school.name} in Midrand.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AffordableSchoolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await getSchoolDetail(slug);

  if (!detail) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[2.2rem] border border-ink/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(24,34,47,0.1)] backdrop-blur md:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">Non-indexed detail page</span>
          <span className="rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky">Demo data</span>
          <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-clay">{getSchoolTypeLabel(detail.school.schoolType)}</span>
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink md:text-5xl">{detail.school.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          {getSuburbName(detail.school.suburbSlug)}, Midrand. This profile uses simulated fees, ratings, tradeoffs, and review content for design and testing only.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Annual fee</p><p className="mt-2 font-bold text-ink">{formatCurrency(detail.school.annualFeeMin)} - {formatCurrency(detail.school.annualFeeMax)}</p></div>
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Monthly estimate</p><p className="mt-2 font-bold text-ink">{formatCurrency(detail.school.monthlyEstimate)}</p></div>
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Registration fee</p><p className="mt-2 font-bold text-ink">{formatCurrency(detail.school.registrationFee)}</p></div>
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Simulated rating</p><p className="mt-2 font-bold text-ink">{detail.school.reviewScore.toFixed(1)} / 5</p></div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-5">
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Why this may suit your family</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink-soft">
              <li>Strongest fit areas: {detail.school.mustHaveFeatures.slice(0, 3).join(", ")}.</li>
              <li>Structured for Grade R to Grade 7 families in Midrand.</li>
              <li>Simulated review count: {detail.school.reviewCount} parent entries.</li>
            </ul>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Quick facts</p>
            <dl className="mt-4 grid gap-3 text-sm text-ink-soft">
              <div><dt className="font-semibold text-ink">Curriculum</dt><dd>{detail.school.curriculum}</dd></div>
              <div><dt className="font-semibold text-ink">Class size estimate</dt><dd>{detail.school.classSizeEstimate} learners</dd></div>
              <div><dt className="font-semibold text-ink">Aftercare</dt><dd>{detail.school.aftercareAvailable ? "Available" : "Not listed in this demo"}</dd></div>
              <div><dt className="font-semibold text-ink">Transport</dt><dd>{detail.school.transportAvailable ? "Available" : "Not listed in this demo"}</dd></div>
              <div><dt className="font-semibold text-ink">Swimming</dt><dd>{detail.school.swimmingAvailable ? "Available" : "No pool listed"}</dd></div>
            </dl>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Facilities and activities</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...detail.school.facilities, ...detail.school.sports].map((item) => (
                <span key={item} className="rounded-full border border-ink/10 bg-sand px-3 py-1 text-sm text-ink-soft">{item}</span>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-5">
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Admissions checklist</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink-soft">
              <li>Confirm the real fee structure directly with the school.</li>
              <li>Ask whether aftercare and transport still have space.</li>
              <li>Verify grade-entry availability and timeline.</li>
              <li>Use this demo page only as a planning prototype.</li>
            </ul>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Simulated reviews</p>
            <div className="mt-4 grid gap-4">
              {detail.reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-ink/10 bg-sand px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-ink">{review.headline}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-soft">{review.reviewerAlias} • {review.gradeRelevantToReview}</p>
                    </div>
                    <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{review.overallScore.toFixed(1)} / 5</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{review.body}</p>
                </article>
              ))}
            </div>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Similar schools nearby</p>
              <Link className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink" href="/affordable-schools/midrand">Back to Midrand hub</Link>
            </div>
            <div className="mt-4 grid gap-3">
              {detail.similarSchools.map((school) => (
                <Link key={school.slug} href={`/affordable-schools/midrand/schools/${school.slug}`} className="rounded-2xl border border-ink/10 bg-sand px-4 py-4 transition hover:border-clay/40">
                  <h2 className="font-bold text-ink">{school.name}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{getSuburbName(school.suburbSlug)} • {formatCurrency(school.annualFeeMin)} - {formatCurrency(school.annualFeeMax)}</p>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}


```

FILE: app\affordable-schools\midrand\shortlist\page.tsx
```tsx
import type { Metadata } from "next";
import Link from "next/link";

import { buildCompareRows } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Your Midrand shortlist",
  description: "Review shortlisted Midrand school options using simulated demo data.",
  robots: {
    index: false,
    follow: false,
  },
};

function parseMonthlyValue(value: string) {
  return Number(value.replace(/[^\d.-]/g, ""));
}

function parseDistanceValue(value: string) {
  return Number(value.replace(/[^\d.-]/g, ""));
}

function getShortlistHighlights(rows: Awaited<ReturnType<typeof buildCompareRows>>) {
  if (rows.length === 0) {
    return [];
  }

  const lowestMonthly = rows.reduce((best, row) =>
    parseMonthlyValue(row.monthlyEstimate) < parseMonthlyValue(best.monthlyEstimate) ? row : best,
  );
  const easiestRun = rows.reduce((best, row) =>
    parseDistanceValue(row.distance) < parseDistanceValue(best.distance) ? row : best,
  );
  const strongestSupport =
    rows.find((row) => row.aftercare === "Yes" && row.transport === "Yes") ??
    rows.find((row) => row.aftercare === "Yes") ??
    rows[0];
  const mostRounded = rows[0];

  return [
    {
      label: "Easiest on monthly budget",
      school: lowestMonthly.name,
      note: `${lowestMonthly.monthlyEstimate} per month`,
    },
    {
      label: "Easiest school run",
      school: easiestRun.name,
      note: `${easiestRun.distance} from your location`,
    },
    {
      label: "Strongest weekday support",
      school: strongestSupport.name,
      note:
        strongestSupport.aftercare === "Yes" && strongestSupport.transport === "Yes"
          ? "Aftercare and transport available"
          : strongestSupport.aftercare === "Yes"
            ? "Aftercare available"
            : "Practical support option",
    },
    {
      label: "Most rounded family fit",
      school: mostRounded.name,
      note: `${mostRounded.bestFor} with ${mostRounded.tradeoff.toLowerCase()}`,
    },
  ];
}

export default async function AffordableSchoolsShortlistPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFiltersFromSearchParams(resolvedSearchParams);
  const schoolsValue = Array.isArray(resolvedSearchParams.schools)
    ? resolvedSearchParams.schools[0]
    : resolvedSearchParams.schools;
  const slugs = (schoolsValue ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
  const rows = await buildCompareRows(slugs, filters);
  const highlights = getShortlistHighlights(rows);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[2rem] border border-ink/10 bg-white/80 p-6 shadow-[0_20px_70px_rgba(24,34,47,0.1)] backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
          Shortlist review
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
          Schools worth keeping on your shortlist
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          Start with the strongest differences first, then use the full table if
          you want a deeper side-by-side check.
        </p>
      </section>

      {rows.length === 0 ? (
        <section className="mt-8 rounded-[1.8rem] border border-ink/10 bg-white/80 p-6 text-ink shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
          <p className="text-lg font-semibold">No schools shortlisted yet.</p>
          <Link
            className="mt-4 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
            href="/affordable-schools/midrand"
          >
            Back to discovery
          </Link>
        </section>
      ) : (
        <>
          <section className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((highlight) => (
              <article
                key={highlight.label}
                className="rounded-[1.6rem] border border-ink/10 bg-white/85 px-4 py-4 shadow-[0_18px_45px_rgba(24,34,47,0.06)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay">
                  {highlight.label}
                </p>
                <h2 className="mt-2 text-lg font-black tracking-tight text-ink">
                  {highlight.school}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{highlight.note}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                  Key differences
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">
                  See what separates your finalists
                </h2>
              </div>
              <p className="text-sm text-ink-soft">
                {rows.length} shortlisted school{rows.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-ink text-white">
                  <tr>
                    <th className="px-4 py-4 font-semibold">School</th>
                    <th className="px-4 py-4 font-semibold">Monthly estimate</th>
                    <th className="px-4 py-4 font-semibold">Distance</th>
                    <th className="px-4 py-4 font-semibold">Aftercare</th>
                    <th className="px-4 py-4 font-semibold">Transport</th>
                    <th className="px-4 py-4 font-semibold">Swimming</th>
                    <th className="px-4 py-4 font-semibold">Sports</th>
                    <th className="px-4 py-4 font-semibold">Rating</th>
                    <th className="px-4 py-4 font-semibold">Best for</th>
                    <th className="px-4 py-4 font-semibold">Tradeoff</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.slug} className={index % 2 === 0 ? "bg-white" : "bg-sand/50"}>
                      <td className="px-4 py-4 font-semibold text-ink">
                        {row.name}
                        <div className="mt-1 text-xs font-normal uppercase tracking-[0.16em] text-ink-soft">
                          {row.suburb} • {row.schoolType}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ink-soft">{row.monthlyEstimate}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.distance}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.aftercare}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.transport}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.swimming}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.sports}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.rating}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.bestFor}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.tradeoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

```

FILE: app\api\affordable-schools\midrand\compare\route.ts
```ts
﻿import { NextResponse } from "next/server";

import { buildCompareRows } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

function normalizeBody(body: Record<string, unknown>) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(body)) {
    if (key === "schools") {
      continue;
    }

    if (Array.isArray(value)) {
      normalized[key] = value.join(",");
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    normalized[key] = String(value);
  }

  return normalized;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown> & {
      schools?: string[];
    };
    const filters = parseFiltersFromSearchParams(normalizeBody(body));
    const rows = await buildCompareRows((body.schools ?? []).slice(0, 4), filters);

    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json(
      {
        error: "invalid_request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}


```

FILE: app\api\affordable-schools\midrand\match\route.ts
```ts
﻿import { NextResponse } from "next/server";

import { matchSchools } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

function normalizeBody(body: Record<string, unknown>) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(body)) {
    if (Array.isArray(value)) {
      normalized[key] = value.join(",");
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    normalized[key] = String(value);
  }

  return normalized;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const filters = parseFiltersFromSearchParams(normalizeBody(body));
    const payload = await matchSchools(filters);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: "invalid_request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}


```

FILE: app\api\affordable-schools\midrand\schools\[slug]\route.ts
```ts
﻿import { NextResponse } from "next/server";

import { getSchoolDetail } from "@/lib/affordable-schools/engine";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, { params }: RouteProps) {
  const { slug } = await params;
  const detail = await getSchoolDetail(slug);

  if (!detail) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}


```

FILE: app\api\claude\route.ts
```ts
import { NextResponse } from "next/server";

import { createClaudeCompletion, getClaudeModel } from "@/lib/claude";

export const runtime = "nodejs";

type ClaudeRequestBody = {
  prompt?: unknown;
  system?: unknown;
  maxTokens?: unknown;
  temperature?: unknown;
  model?: unknown;
};

type ParsedClaudeRequestBody = {
  prompt: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
};

function parseBody(body: ClaudeRequestBody): ParsedClaudeRequestBody {
  if (typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
    throw new Error("The request body must include a non-empty prompt string.");
  }

  if (body.maxTokens !== undefined && (!Number.isInteger(body.maxTokens) || Number(body.maxTokens) <= 0)) {
    throw new Error("maxTokens must be a positive integer.");
  }

  if (
    body.temperature !== undefined &&
    (typeof body.temperature !== "number" || Number.isNaN(body.temperature) || body.temperature < 0 || body.temperature > 1)
  ) {
    throw new Error("temperature must be a number between 0 and 1.");
  }

  if (body.system !== undefined && typeof body.system !== "string") {
    throw new Error("system must be a string when provided.");
  }

  if (body.model !== undefined && typeof body.model !== "string") {
    throw new Error("model must be a string when provided.");
  }

  return {
    prompt: body.prompt.trim(),
    system: typeof body.system === "string" ? body.system : undefined,
    maxTokens: typeof body.maxTokens === "number" ? body.maxTokens : undefined,
    temperature: typeof body.temperature === "number" ? body.temperature : undefined,
    model: typeof body.model === "string" ? body.model : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const body = parseBody((await request.json()) as ClaudeRequestBody);
    const { message, text } = await createClaudeCompletion(body);

    return NextResponse.json({
      model: message.model ?? body.model ?? getClaudeModel(),
      text,
      stopReason: message.stop_reason,
      usage: message.usage,
      content: message.content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      message.startsWith("The request body") || message.includes("must be")
        ? 400
        : 500;

    return NextResponse.json(
      {
        error: "claude_request_failed",
        message,
      },
      { status },
    );
  }
}

```

FILE: app/layout.tsx
```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AffordableSchools",
    template: "%s | AffordableSchools",
  },
  description:
    "AffordableSchools helps Midrand families shortlist affordable primary schools with simulated budget, commute, and feature matching.",
  applicationName: "AffordableSchools",
  alternates: {
    canonical: "/affordable-schools/midrand",
  },
  openGraph: {
    type: "website",
    url: "/affordable-schools/midrand",
    siteName: "AffordableSchools",
    title: "AffordableSchools",
    description:
      "Parent-first school matching for Midrand families, powered by clearly labeled simulated demo data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AffordableSchools",
    description:
      "Find affordable primary schools in Midrand with budget, commute, and shortlist-first matching.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-sand text-ink">
      <body>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,164,90,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(55,114,255,0.14),_transparent_22%),linear-gradient(180deg,_#fffdf7_0%,_#f5efe2_100%)]">
          <div className="sticky top-0 z-40 border-b border-ink/10 bg-white/85 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[1.1rem] bg-ink text-sm font-black text-white shadow-[0_12px_30px_rgba(24,34,47,0.18)]">
                  AS
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-clay">
                    AffordableSchools
                  </p>
                  <p className="text-sm font-semibold text-ink">Midrand</p>
                </div>
              </div>
              <div className="rounded-full border border-ink/10 bg-sand px-3 py-1.5 text-[11px] font-semibold text-ink-soft">
                2026
              </div>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

```

FILE: app\page.tsx
```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/affordable-schools/midrand");
}

```

FILE: app\sitemap.ts
```ts
import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return [
    {
      url: `${siteUrl}/affordable-schools/midrand`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/affordable-primary-schools/midrand`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}

```

FILE: components/affordable-schools/filter-panel.tsx
```tsx
"use client";

import { useState } from "react";

import { getMidrandSuburbs } from "@/lib/affordable-schools/shared";
import {
  CHILD_GRADES,
  SCHOOL_TYPE_PREFERENCES,
  type Feature,
  type MatchFilters,
} from "@/lib/affordable-schools/types";

type FilterPanelProps = {
  filters: MatchFilters;
  onUpdate: <K extends keyof MatchFilters>(
    key: K,
    value: MatchFilters[K],
  ) => void;
  onLocationLabelChange?: (label: string | null) => void;
};

const budgetMin = 3500;
const budgetMax = 14000;
const budgetStep = 500;
const randFormatter = new Intl.NumberFormat("en-US");

const commuteLabels: Record<MatchFilters["maxCommute"], string> = {
  under_3_km: "Under 3 km",
  under_5_km: "Under 5 km",
  under_8_km: "Under 8 km",
  under_12_km: "Under 12 km",
  best_within_20_min: "Best within 20 min",
};

const commuteOptions: MatchFilters["maxCommute"][] = [
  "under_3_km",
  "under_5_km",
  "under_8_km",
  "under_12_km",
  "best_within_20_min",
];

const schoolTypeLabels: Record<MatchFilters["schoolType"], string> = {
  private_only: "Private only",
  public_only: "Public only",
  both: "Both",
};

const mustHaveFeatures = [
  "Aftercare",
  "Transport",
  "Small classes",
  "Swimming",
  "Music",
  "Coding/Robotics",
  "Library",
  "Religious alignment",
] as const satisfies readonly Feature[];

const niceToHaveFeatures = [
  "Extra murals",
  "Modern classrooms",
  "Meal option",
  "Holiday care",
  "Sibling discount",
] as const satisfies readonly Feature[];

function toggleFeature(list: Feature[], feature: Feature) {
  return list.includes(feature)
    ? list.filter((item) => item !== feature)
    : [...list, feature];
}

function formatRand(value: number) {
  return `R${randFormatter.format(value)}`;
}

function getRangeProgress(value: number, min: number, max: number) {
  if (max === min) {
    return "0%";
  }

  return `${((value - min) / (max - min)) * 100}%`;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLatitude - fromLatitude);
  const dLon = toRadians(toLongitude - fromLongitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLatitude)) *
      Math.cos(toRadians(toLatitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearestSuburb(
  latitude: number,
  longitude: number,
  suburbs: ReturnType<typeof getMidrandSuburbs>,
) {
  return suburbs.reduce(
    (closest, suburb) => {
      const suburbDistance = getDistanceKm(
        latitude,
        longitude,
        suburb.latitude,
        suburb.longitude,
      );

      if (!closest || suburbDistance < closest.distanceKm) {
        return {
          slug: suburb.slug,
          name: suburb.name,
          distanceKm: suburbDistance,
        };
      }

      return closest;
    },
    null as { slug: string; name: string; distanceKm: number } | null,
  );
}

type ChipButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function ChipButton({ active, children, onClick }: ChipButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3.5 py-2 text-sm transition ${
        active
          ? "border-ink bg-ink text-white"
          : "border-ink/10 bg-white text-ink-soft hover:border-clay/40 hover:text-ink"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  filters,
  onUpdate,
  onLocationLabelChange,
}: FilterPanelProps) {
  const suburbs = getMidrandSuburbs();
  const gradeIndex = CHILD_GRADES.indexOf(filters.childGrade);
  const commuteIndex = commuteOptions.indexOf(filters.maxCommute);
  const [locationState, setLocationState] = useState<
    "idle" | "requesting" | "success" | "error"
  >("idle");
  const [locationMessage, setLocationMessage] = useState<string>(
    "Allow location to estimate commute from where you are now.",
  );

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setLocationState("error");
      setLocationMessage("Location services are not available on this device.");
      onLocationLabelChange?.(null);
      return;
    }

    setLocationState("requesting");
    setLocationMessage("Requesting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearestSuburb = getNearestSuburb(
          position.coords.latitude,
          position.coords.longitude,
          suburbs,
        );

        if (!nearestSuburb) {
          setLocationState("error");
          setLocationMessage(
            "We could not match your location to a Midrand suburb.",
          );
          onLocationLabelChange?.(null);
          return;
        }

        onUpdate("homeSuburb", nearestSuburb.slug);
        onLocationLabelChange?.(nearestSuburb.name);
        setLocationState("success");
        setLocationMessage(
          `Location on. Using ${nearestSuburb.name} for a more realistic school run.`,
        );
      },
      () => {
        setLocationState("error");
        setLocationMessage(
          "Location access was declined. We will keep showing wider Midrand matches.",
        );
        onLocationLabelChange?.(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-semibold text-ink">Monthly budget</p>
        <div className="mt-3 rounded-[1.4rem] border border-ink/10 bg-sand px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-black text-ink">
              {formatRand(filters.budgetValue)}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
              per month
            </p>
          </div>
          <input
            className="app-range mt-4 h-2 w-full cursor-pointer rounded-full"
            type="range"
            min={budgetMin}
            max={budgetMax}
            step={budgetStep}
            value={filters.budgetValue}
            style={{
              ["--range-progress" as string]: getRangeProgress(
                filters.budgetValue,
                budgetMin,
                budgetMax,
              ),
            }}
            onChange={(event) => {
              onUpdate("budgetType", "monthly");
              onUpdate("budgetValue", Number(event.target.value));
            }}
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
            <span>{formatRand(budgetMin)}</span>
            <span>{formatRand(budgetMax)}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Child grade</p>
        <div className="mt-3 rounded-[1.4rem] border border-ink/10 bg-sand px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-black text-ink">{filters.childGrade}</p>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
              Grade range
            </p>
          </div>
          <input
            className="app-range mt-4 h-2 w-full cursor-pointer rounded-full"
            type="range"
            min={0}
            max={CHILD_GRADES.length - 1}
            step={1}
            value={gradeIndex}
            style={{
              ["--range-progress" as string]: getRangeProgress(
                gradeIndex,
                0,
                CHILD_GRADES.length - 1,
              ),
            }}
            onChange={(event) =>
              onUpdate("childGrade", CHILD_GRADES[Number(event.target.value)])
            }
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
            <span>{CHILD_GRADES[0]}</span>
            <span>{CHILD_GRADES[CHILD_GRADES.length - 1]}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Commute</p>
        <div className="mt-3 rounded-[1.5rem] border border-ink/10 bg-sand px-4 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">
                Make commute estimates more realistic
              </p>
              <p className="mt-1 text-xs leading-5 text-ink-soft">
                Turn on location so we can use your current area for a more
                realistic school run.
              </p>
            </div>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                locationState === "success"
                  ? "bg-leaf text-white"
                  : "bg-ink text-white hover:bg-ink/90"
              }`}
              onClick={useCurrentLocation}
            >
              {locationState === "requesting"
                ? "Checking location..."
                : locationState === "success"
                  ? "Location active"
                  : "Use my location"}
            </button>
          </div>
          <p
            className={`mt-3 text-xs leading-5 ${
              locationState === "error"
                ? "text-clay"
                : locationState === "success"
                  ? "text-leaf"
                  : "text-ink-soft"
            }`}
          >
            {locationMessage}
          </p>
          {locationState === "success" ? (
            <div className="mt-4 rounded-[1.25rem] border border-ink/10 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">
                  Preferred school-run distance
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  {commuteLabels[filters.maxCommute]}
                </p>
              </div>
              <input
                className="app-range mt-4 h-2 w-full cursor-pointer rounded-full"
                type="range"
                min={0}
                max={commuteOptions.length - 1}
                step={1}
                value={commuteIndex >= 0 ? commuteIndex : 2}
                style={{
                  ["--range-progress" as string]: getRangeProgress(
                    commuteIndex >= 0 ? commuteIndex : 2,
                    0,
                    commuteOptions.length - 1,
                  ),
                }}
                onChange={(event) =>
                  onUpdate(
                    "maxCommute",
                    commuteOptions[Number(event.target.value)],
                  )
                }
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
                <span>{commuteLabels[commuteOptions[0]]}</span>
                <span>
                  {commuteLabels[commuteOptions[commuteOptions.length - 1]]}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">School type</p>
        <div className="relative mt-3 rounded-[1.4rem] border border-ink/10 bg-sand px-4 py-3">
          <select
            className="app-select w-full appearance-none bg-transparent pr-8 text-sm font-semibold text-ink outline-none"
            value={filters.schoolType}
            onChange={(event) =>
              onUpdate(
                "schoolType",
                event.target.value as MatchFilters["schoolType"],
              )
            }
          >
            {SCHOOL_TYPE_PREFERENCES.map((option) => (
              <option key={option} value={option}>
                {schoolTypeLabels[option]}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
            v
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Need this</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {mustHaveFeatures.map((feature) => (
            <ChipButton
              key={feature}
              active={filters.mustHaveFeatures.includes(feature)}
              onClick={() =>
                onUpdate(
                  "mustHaveFeatures",
                  toggleFeature(filters.mustHaveFeatures, feature),
                )
              }
            >
              {feature}
            </ChipButton>
          ))}
        </div>
      </div>
    </div>
  );
}

```

FILE: components/affordable-schools/landing-page.tsx
```tsx
import { LiveDiscovery } from "@/components/affordable-schools/live-discovery";
import { matchSchools } from "@/lib/affordable-schools/engine";
import { getDefaultFilters } from "@/lib/affordable-schools/shared";

type LandingPageProps = {
  variant: "hub" | "primary";
};

export async function LandingPage({ variant }: LandingPageProps) {
  const filters = getDefaultFilters();
  const payload = await matchSchools(filters);

  return (
    <LiveDiscovery
      variant={variant}
      initialFilters={filters}
      initialResults={payload.matches}
      initialSource={payload.source}
    />
  );
}

```

FILE: components/affordable-schools/live-discovery.tsx
```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FilterPanel } from "@/components/affordable-schools/filter-panel";
import { ResultsList } from "@/components/affordable-schools/results-list";
import { getDefaultFilters } from "@/lib/affordable-schools/shared";
import type { MatchFilters, MatchResult } from "@/lib/affordable-schools/types";

type LiveDiscoveryProps = {
  variant: "hub" | "primary";
  initialFilters?: MatchFilters;
  initialResults: MatchResult[];
  initialSource: string;
};

export function LiveDiscovery({
  variant,
  initialFilters = getDefaultFilters(),
  initialResults,
  initialSource,
}: LiveDiscoveryProps) {
  const [filters, setFilters] = useState<MatchFilters>(initialFilters);
  const [results, setResults] = useState<MatchResult[]>(initialResults);
  const [source, setSource] = useState(initialSource);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const isHub = variant === "hub";

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    const controller = new AbortController();

    debounceRef.current = window.setTimeout(async () => {
      setIsRefreshing(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/affordable-schools/midrand/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
          signal: controller.signal,
        });

        const payload = (await response.json()) as
          | { matches: MatchResult[]; source: string }
          | { error: string; message?: string };

        if (!response.ok || !("matches" in payload)) {
          setErrorMessage(
            "message" in payload
              ? (payload.message ?? "We could not refresh your matches.")
              : "We could not refresh your matches.",
          );
          return;
        }

        setResults(payload.matches);
        setSource(payload.source);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setErrorMessage("We could not refresh your school list just now.");
      } finally {
        setIsRefreshing(false);
      }
    }, 180);

    return () => {
      controller.abort();
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [filters]);

  function update<K extends keyof MatchFilters>(
    key: K,
    value: MatchFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      ...(key === "budgetValue" ? { budgetType: "monthly" as const } : {}),
      [key]: value,
    }));
  }

  const shortlistInsights = useMemo(() => {
    const visibleResults = results.slice(0, 6);

    if (visibleResults.length === 0) {
      return {
        summary:
          "Widen the commute or relax one must-have to uncover more realistic Midrand options.",
        chips: ["Wider commute", "More schools", "Try fewer must-haves"],
        stats: [
          { label: "Aftercare", value: "0 ready" },
          { label: "Transport", value: "0 ready" },
          { label: "Activities", value: "0 strong" },
        ],
      };
    }

    const aftercareCount = visibleResults.filter(
      (result) => result.school.aftercareAvailable,
    ).length;
    const transportCount = visibleResults.filter(
      (result) => result.school.transportAvailable,
    ).length;
    const smallerClassCount = visibleResults.filter(
      (result) => result.school.classSizeEstimate <= 24,
    ).length;
    const activityRichCount = visibleResults.filter(
      (result) =>
        result.school.sports.length >= 3 ||
        result.school.swimmingAvailable ||
        result.school.mustHaveFeatures.includes("Music") ||
        result.school.mustHaveFeatures.includes("Coding/Robotics") ||
        result.school.niceToHaveFeatures.includes("Extra murals"),
    ).length;

    const insightCandidates = [
      aftercareCount >= 3 ? "Aftercare support" : null,
      transportCount >= 3 ? "Transport options" : null,
      activityRichCount >= 3 ? "Sport and extra murals" : null,
      smallerClassCount >= 3 ? "Smaller classes" : null,
      visibleResults.some((result) => result.school.swimmingAvailable)
        ? "Swimming access"
        : null,
    ].filter(Boolean) as string[];

    const chips = insightCandidates.slice(0, 4);
    const summaryLead =
      chips.length > 0 ? chips.join(", ") : "daily routine fit";
    const shorterRunCount = visibleResults.filter(
      (result) => result.distanceKm <= 4,
    ).length;
    return {
      summary: `These schools currently rise for ${summaryLead.toLowerCase()}${
        shorterRunCount >= 3 ? ", with several easier school-run options" : ""
      }.`,
      chips:
        chips.length > 0 ? chips : ["Daily routine fit", "School-life signals"],
      stats: [
        {
          label: "Aftercare",
          value: `${aftercareCount}/${visibleResults.length}`,
        },
        {
          label: "Transport",
          value: `${transportCount}/${visibleResults.length}`,
        },
        {
          label: "Activities",
          value: `${activityRichCount}/${visibleResults.length}`,
        },
      ],
    };
  }, [results]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <section className="rounded-[2.25rem] border border-ink/10 bg-white/88 p-6 shadow-[0_22px_70px_rgba(24,34,47,0.08)] backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
          AffordableSchools
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight text-ink md:text-5xl">
          {isHub
            ? "Welcome. Find Midrand schools that suit your family."
            : "Welcome. Find affordable primary schools in Midrand more easily."}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          Real-time school matching for parents who want faster decisions on
          monthly cost, commute, care options, and school-life fit.
        </p>
      </section>

      <section className="mt-5 rounded-[1.8rem] border border-ink/10 bg-sand/70 px-5 py-5 shadow-[0_16px_45px_rgba(24,34,47,0.05)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">
          Midrand school guide
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-ink-soft md:text-[15px]">
          {isHub
            ? "Explore affordable schools in Midrand with a live shortlist built for parents. Filter by monthly budget, grade, distance from your location, and the school qualities that matter most, then see school cards update instantly."
            : "Explore affordable primary schools in Midrand with a live shortlist built for families from Grade R to Grade 7. Filter by monthly budget, distance from your location, and practical school qualities, then review matching schools in real time."}
        </p>
      </section>

      <section className="mt-5 rounded-[1.8rem] border border-ink/10 bg-white/90 px-5 py-5 shadow-[0_18px_50px_rgba(24,34,47,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-ink/10 bg-sand px-3.5 py-1.5 text-sm font-semibold text-ink">
              {isRefreshing
                ? "Refreshing..."
                : `${results.length} schools found`}
            </div>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
            Live filters
          </p>
        </div>

        <div className="mt-5">
          <FilterPanel
            filters={filters}
            onUpdate={update}
            onLocationLabelChange={setLocationLabel}
          />
        </div>
      </section>

      <section className="mt-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay">
              School cards
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-ink md:text-2xl">
              Schools matching right now
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
              {shortlistInsights.summary} Showing live results{" "}
              {locationLabel ? `near ${locationLabel}` : "across Midrand"} for{" "}
              {filters.childGrade.toLowerCase()}.
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
            Source: {source}
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-[1.4rem] border border-clay/20 bg-white px-4 py-3 text-sm text-ink shadow-[0_18px_55px_rgba(24,34,47,0.06)]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-5">
          <ResultsList filters={filters} results={results} />
        </div>
      </section>
    </main>
  );
}

```

FILE: components/affordable-schools/results-list.tsx
```tsx
﻿"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  formatCurrency,
  getSchoolTypeLabel,
  getSuburbName,
} from "@/lib/affordable-schools/shared";
import { serializeFilters } from "@/lib/affordable-schools/query";
import type { MatchFilters, MatchResult } from "@/lib/affordable-schools/types";

type ResultsListProps = {
  filters: MatchFilters;
  results: MatchResult[];
};

function getClassroomLabel(classSizeEstimate: number) {
  if (classSizeEstimate <= 22) {
    return "Smaller classes";
  }

  if (classSizeEstimate <= 30) {
    return "Balanced class size";
  }

  return "Larger class groups";
}

function getActivityHighlights(result: MatchResult) {
  const highlightPool = [
    ...result.school.sports,
    ...(result.school.swimmingAvailable ? ["Swimming"] : []),
    ...result.school.mustHaveFeatures.filter((feature) =>
      ["Music", "Coding/Robotics", "Extra murals"].includes(feature),
    ),
    ...result.school.niceToHaveFeatures.filter((feature) =>
      ["Music", "Coding/Robotics", "Extra murals"].includes(feature),
    ),
  ];

  return highlightPool
    .filter((item, index, list) => list.indexOf(item) === index)
    .slice(0, 4);
}

function getParentFitSummary(result: MatchResult) {
  const support = result.school.aftercareAvailable ? "aftercare" : null;
  const transport = result.school.transportAvailable ? "transport" : null;
  const smallerClasses =
    result.school.classSizeEstimate <= 24 ? "smaller classes" : null;
  const activities = getActivityHighlights(result)[0]?.toLowerCase() ?? null;

  const fitReasons = [support, transport, smallerClasses, activities].filter(
    Boolean,
  ) as string[];

  if (fitReasons.length === 0) {
    return "A balanced option across routine, school basics, and day-to-day fit.";
  }

  return `May suit families who care about ${fitReasons.slice(0, 3).join(", ")}.`;
}

function getFeatureChips(result: MatchResult, activityHighlights: string[]) {
  const activitySet = new Set(activityHighlights);

  return [...result.school.mustHaveFeatures, ...result.school.facilities]
    .filter((feature, index, list) => list.indexOf(feature) === index)
    .filter((feature) => !activitySet.has(feature))
    .slice(0, 6);
}

export function ResultsList({ filters, results }: ResultsListProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const filtersQuery = useMemo(() => serializeFilters(filters), [filters]);

  function toggleSelection(slug: string) {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length >= 4
          ? current
          : [...current, slug],
    );
  }

  function goToCompare() {
    const params = new URLSearchParams(filtersQuery);
    params.set("schools", selected.join(","));
    router.push(`/affordable-schools/midrand/shortlist?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 pb-24 md:pb-6">
      {results.map((result) => {
        const isSelected = selected.includes(result.school.slug);
        const activityHighlights = getActivityHighlights(result);
        const featureChips = getFeatureChips(result, activityHighlights);

        return (
          <article
            key={result.school.slug}
            className="rounded-[1.5rem] border border-ink/10 bg-white/92 p-4 shadow-[0_18px_50px_rgba(24,34,47,0.07)] backdrop-blur"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Fit score {result.fitScore}
                  </span>
                  <span className="rounded-full bg-clay/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-clay">
                    {getSchoolTypeLabel(result.school.schoolType)}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-black tracking-tight text-ink md:text-[1.35rem]">
                  {result.school.name}
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-ink-soft md:text-sm">
                  {getSuburbName(result.school.suburbSlug)} •{" "}
                  {result.tradeoffLabel} •{" "}
                  {result.topMatchingFeatures.join(", ") ||
                    "Balanced Midrand option"}
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-ink/10 bg-sand px-3.5 py-3 text-sm text-ink lg:min-w-[210px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Monthly fee estimate
                </p>
                <p className="mt-1.5 text-xl font-black text-ink">
                  {formatCurrency(result.school.monthlyEstimate)}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-soft">
                  <p>
                    <span className="font-semibold text-ink">
                      {result.distanceKm.toFixed(1)} km
                    </span>
                    <span className="block">from your area</span>
                  </p>
                  <p>
                    <span className="font-semibold text-ink">
                      {result.school.curriculum}
                    </span>
                    <span className="block">
                      {getClassroomLabel(result.school.classSizeEstimate)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Aftercare:</span>{" "}
                    {result.school.aftercareAvailable
                      ? "Available"
                      : "Not listed"}
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Transport:</span>{" "}
                    {result.school.transportAvailable ? "Listed" : "Not listed"}
                  </p>
                </div>
                <div className="mt-2.5 border-t border-ink/10 pt-2.5 text-xs text-ink-soft">
                  <p className="font-semibold text-ink">
                    {activityHighlights.slice(0, 2).join(", ") ||
                      "Core activities"}
                  </p>
                  <p className="mt-1">
                    {activityHighlights.length > 2
                      ? `${activityHighlights[2]}${activityHighlights[3] ? `, ${activityHighlights[3]}` : ""}`
                      : result.school.swimmingAvailable
                        ? "Swimming listed"
                        : "Fewer extras listed"}
                  </p>
                </div>
                {featureChips.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-ink/10 pt-2.5">
                    {featureChips.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-ink/10 bg-white px-2.5 py-1 text-[11px] text-ink-soft"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {result.missingMustHaves.length > 0 ? (
              <div className="mt-4 rounded-[1.2rem] border border-clay/20 bg-clay/10 px-3.5 py-3 text-sm text-ink">
                Tradeoff to note: missing {result.missingMustHaves.join(", ")}
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <Link
                className="rounded-full bg-ink px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-ink/90"
                href={`/affordable-schools/midrand/schools/${result.school.slug}?${filtersQuery}`}
              >
                View school
              </Link>
              <button
                type="button"
                className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  isSelected
                    ? "border-sky bg-sky text-white"
                    : "border-ink/10 bg-white text-ink hover:border-sky/40"
                }`}
                onClick={() => toggleSelection(result.school.slug)}
              >
                {isSelected ? "Shortlisted" : "Shortlist"}
              </button>
            </div>
          </article>
        );
      })}

      {selected.length > 0 ? (
        <div className="sticky bottom-24 z-20 flex flex-col gap-3 rounded-[1.4rem] border border-ink/10 bg-ink p-4 text-white shadow-[0_24px_70px_rgba(24,34,47,0.18)] md:bottom-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Shortlist
            </p>
            <p className="mt-1 text-sm text-white/80">
              {selected.length} school{selected.length === 1 ? "" : "s"} shortlisted.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold/90"
            onClick={goToCompare}
          >
            Review shortlist
          </button>
        </div>
      ) : null}
    </div>
  );
}

```

FILE: components/affordable-schools/search-wizard.tsx
```tsx
﻿"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { getDefaultFilters, getMidrandSuburbs } from "@/lib/affordable-schools/shared";
import { serializeFilters } from "@/lib/affordable-schools/query";
import {
  CHILD_GRADES,
  FEATURES,
  MAX_COMMUTE_OPTIONS,
  SCHOOL_TYPE_PREFERENCES,
  type Feature,
  type MatchFilters,
} from "@/lib/affordable-schools/types";

type SearchWizardProps = {
  ctaLabel?: string;
  tone?: "hub" | "leaf";
};

const commuteLabels: Record<MatchFilters["maxCommute"], string> = {
  under_3_km: "Under 3 km",
  under_5_km: "Under 5 km",
  under_8_km: "Under 8 km",
  under_12_km: "Under 12 km",
  best_within_20_min: "Best options within 20 min",
};

const schoolTypeLabels: Record<MatchFilters["schoolType"], string> = {
  private_only: "Private only",
  public_only: "Public only",
  both: "Both",
};

function featureToggle(list: Feature[], feature: Feature) {
  return list.includes(feature)
    ? list.filter((item) => item !== feature)
    : [...list, feature];
}

export function SearchWizard({
  ctaLabel = "Find schools that fit your budget",
  tone = "hub",
}: SearchWizardProps) {
  const router = useRouter();
  const suburbs = getMidrandSuburbs();
  const defaults = getDefaultFilters();
  const [filters, setFilters] = useState<MatchFilters>(defaults);
  const [isPending, setIsPending] = useState(false);

  function update<K extends keyof MatchFilters>(key: K, value: MatchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function submitWizard() {
    setIsPending(true);
    startTransition(() => {
      const query = serializeFilters(filters);
      router.push(`/affordable-schools/midrand/results?${query}`);
    });
  }

  return (
    <section className="rounded-[2rem] border border-ink/10 bg-white/80 p-5 shadow-[0_24px_80px_rgba(24,34,47,0.12)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
            Parent Match Wizard
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-ink md:text-4xl">
            Start with your family constraints before you browse schools.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft md:text-base">
            This prototype ranks Midrand schools using simulated fees, distances,
            features, and reviews. Use it to test flows, not to make real school decisions.
          </p>
        </div>
        <div className="rounded-full border border-clay/20 bg-clay/10 px-4 py-2 text-sm font-semibold text-clay">
          {tone === "hub" ? "Broad Midrand hub" : "Primary-school leaf intent"}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">
              What grade is your child entering?
            </span>
            <select
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none ring-0"
              value={filters.childGrade}
              onChange={(event) => update("childGrade", event.target.value as MatchFilters["childGrade"])}
            >
              {CHILD_GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Budget type</span>
              <select
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                value={filters.budgetType}
                onChange={(event) => update("budgetType", event.target.value as MatchFilters["budgetType"])}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">School fee budget</span>
              <input
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                type="number"
                min={1000}
                max={250000}
                step={500}
                value={filters.budgetValue}
                onChange={(event) => update("budgetValue", Number(event.target.value))}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Where do you live?</span>
              <select
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                value={filters.homeSuburb}
                onChange={(event) => update("homeSuburb", event.target.value)}
              >
                {suburbs.map((suburb) => (
                  <option key={suburb.slug} value={suburb.slug}>
                    {suburb.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Where do you work? Optional</span>
              <select
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                value={filters.workSuburb ?? ""}
                onChange={(event) => update("workSuburb", event.target.value)}
              >
                <option value="">Skip this for now</option>
                {suburbs.map((suburb) => (
                  <option key={suburb.slug} value={suburb.slug}>
                    {suburb.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">How far are you willing to travel?</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {MAX_COMMUTE_OPTIONS.map((option) => {
                const active = filters.maxCommute === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-sky bg-sky/10 text-ink"
                        : "border-ink/10 bg-white text-ink-soft hover:border-clay/30 hover:bg-clay/5"
                    }`}
                    onClick={() => update("maxCommute", option)}
                  >
                    <span className="font-semibold">{commuteLabels[option]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <p className="text-sm font-semibold text-ink">What must the school have?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURES.slice(0, 11).map((feature) => {
                const active = filters.mustHaveFeatures.includes(feature);

                return (
                  <button
                    key={feature}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-ink/10 bg-white text-ink-soft hover:border-clay/40 hover:text-ink"
                    }`}
                    onClick={() => update("mustHaveFeatures", featureToggle(filters.mustHaveFeatures, feature))}
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Anything nice to have?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURES.slice(11).map((feature) => {
                const active = filters.niceToHaveFeatures.includes(feature);

                return (
                  <button
                    key={feature}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-clay bg-clay text-white"
                        : "border-ink/10 bg-white text-ink-soft hover:border-clay/40 hover:text-ink"
                    }`}
                    onClick={() =>
                      update("niceToHaveFeatures", featureToggle(filters.niceToHaveFeatures, feature))
                    }
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">What type of school are you open to?</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {SCHOOL_TYPE_PREFERENCES.map((option) => {
                const active = filters.schoolType === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-leaf bg-leaf text-white"
                        : "border-ink/10 bg-white text-ink-soft hover:border-leaf/40 hover:text-ink"
                    }`}
                    onClick={() => update("schoolType", option)}
                  >
                    <span className="font-semibold">{schoolTypeLabels[option]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-ink/10 bg-ink px-5 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Demo rules
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/80">
              <li>Only Midrand-focused primary results are included in Phase 1.</li>
              <li>All fees, reviews, scores, and distances are simulated.</li>
              <li>Compare up to 4 schools side by side.</li>
            </ul>
            <button
              type="button"
              className="mt-5 w-full rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold/90 disabled:cursor-progress disabled:opacity-70"
              onClick={submitWizard}
              disabled={isPending}
            >
              {isPending ? "Building your shortlist..." : ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}



```

FILE: lib/affordable-schools/engine.ts
```ts
import { getServerDbPool, hasUsableSupabaseDbUrl } from "@/lib/db/server";
import { MIDRAND_LAST_UPDATED_AT, midrandSchoolSeeds, midrandSuburbs, schoolCoverage } from "@/lib/affordable-schools/catalog";
import type {
  BudgetType,
  CompareRow,
  Feature,
  MatchFilters,
  MatchResult,
  SchoolDetailPayload,
  SchoolRecord,
  SchoolReview,
  SchoolType,
  SchoolTypePreference,
  Suburb,
} from "@/lib/affordable-schools/types";

type DbSchoolRow = {
  id: string;
  name: string;
  slug: string;
  suburb_slug: string;
  school_type: SchoolType;
  annual_fee_min: string;
  annual_fee_max: string;
  monthly_estimate: string;
  registration_fee: string;
  deposit_fee: string;
  aftercare_available: boolean;
  transport_available: boolean;
  swimming_available: boolean;
  sports: string[] | null;
  facilities: string[] | null;
  must_have_features: Feature[] | null;
  nice_to_have_features: Feature[] | null;
  curriculum: string;
  religious_affiliation: string | null;
  class_size_estimate: number;
  latitude: string;
  longitude: string;
  distance_from_suburb_center_km: string;
  review_score: string;
  review_count: number;
  confidence_level: "simulated";
  updated_at: string;
};

type DbReviewRow = {
  id: string;
  school_slug: string;
  reviewer_alias: string;
  overall_score: string;
  headline: string;
  body: string;
  pros: string[] | null;
  cons: string[] | null;
  grade_relevant_to_review: string;
  dimension_scores: Record<string, number>;
  created_at: string;
};

const moneyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

const commuteThresholds: Record<MatchFilters["maxCommute"], number> = {
  under_3_km: 3,
  under_5_km: 5,
  under_8_km: 8,
  under_12_km: 12,
  best_within_20_min: 7,
};

const aliasPrefixes = [
  "Parent from",
  "Grade family in",
  "Midrand guardian",
  "Working parent in",
  "Aftercare parent from",
] as const;

const reviewHeadlines = [
  "Balanced option for practical families",
  "Good value if transport matters",
  "Helpful staff and solid routines",
  "Strong fit for a tighter budget",
  "Worth considering for daily logistics",
] as const;

const reviewBodies = [
  "Our child settled quickly and the school feels practical for families watching both fees and travel time.",
  "The experience feels structured, and the value is easier to justify than some pricier Midrand options nearby.",
  "Communication has been steady and the daily routine feels manageable for a working household.",
  "It is not the flashiest campus, but it covers the basics well and the overall cost feels more realistic.",
  "This school stood out because the tradeoff between fees, location, and activities felt easier to manage.",
] as const;

const reviewPros = [
  "Clear daily routine",
  "Budget feels manageable",
  "Good commute fit",
  "Friendly admin team",
  "Useful aftercare option",
  "Solid activity mix",
] as const;

const reviewCons = [
  "Busy drop-off times",
  "Facilities feel more practical than premium",
  "Transport routes can fill up",
  "Popular grades feel full",
  "Some extras cost more",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function roundWhole(value: number) {
  return Math.round(value);
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistanceKm(fromLat: number, fromLng: number, toLat: number, toLng: number) {
  const earthRadiusKm = 6371;
  const latDelta = toRadians(toLat - fromLat);
  const lngDelta = toRadians(toLng - fromLng);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(lngDelta / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function annualizeBudget(budgetType: BudgetType, budgetValue: number) {
  return budgetType === "monthly" ? budgetValue * 12 : budgetValue;
}

function normalizeSchoolTypeLabel(schoolType: SchoolType) {
  switch (schoolType) {
    case "public":
      return "Public";
    case "private_low_fee":
      return "Private low-fee";
    case "private_mid_tier":
      return "Private mid-tier";
    default:
      return "Private premium";
  }
}

function calculateBudgetFit(annualCost: number, annualBudget: number) {
  if (annualCost <= annualBudget) {
    return 100;
  }

  if (annualCost <= annualBudget * 1.1) {
    return 70;
  }

  if (annualCost <= annualBudget * 1.25) {
    return 40;
  }

  return 0;
}

function calculateDistanceFit(distanceKm: number, maxCommute: MatchFilters["maxCommute"]) {
  const threshold = commuteThresholds[maxCommute];

  if (distanceKm <= threshold) {
    return 100;
  }

  const maxDistance = threshold + 8;
  const decay = 1 - (distanceKm - threshold) / (maxDistance - threshold);
  return roundWhole(Math.max(decay, 0) * 100);
}

function calculateMustHaveFit(school: SchoolRecord, mustHaveFeatures: Feature[]) {
  if (mustHaveFeatures.length === 0) {
    return { score: 100, missing: [] as Feature[] };
  }

  const missing = mustHaveFeatures.filter((feature) => !school.mustHaveFeatures.includes(feature));
  const matched = mustHaveFeatures.length - missing.length;
  const base = (matched / mustHaveFeatures.length) * 100;
  const penalty = missing.length > 0 ? 20 : 0;

  return {
    score: roundWhole(Math.max(base - penalty, 0)),
    missing,
  };
}

function calculateNiceToHaveFit(school: SchoolRecord, niceToHaveFeatures: Feature[]) {
  if (niceToHaveFeatures.length === 0) {
    return 100;
  }

  const matches = niceToHaveFeatures.filter((feature) =>
    school.mustHaveFeatures.includes(feature) || school.niceToHaveFeatures.includes(feature),
  ).length;

  return roundWhole((matches / niceToHaveFeatures.length) * 100);
}

function calculateSchoolTypeFit(schoolType: SchoolType, preference: SchoolTypePreference) {
  if (preference === "both") {
    return 100;
  }

  if (preference === "public_only") {
    return schoolType === "public" ? 100 : 0;
  }

  return schoolType === "public" ? 0 : 100;
}

function pickTradeoffLabel(result: Omit<MatchResult, "tradeoffLabel">) {
  if (result.budgetFit >= 95 && result.mustHaveFit >= 80) {
    return "Best budget fit";
  }

  if (result.distanceFit >= 92) {
    return "Closest match";
  }

  if (result.mustHaveFit >= 95) {
    return "Best feature match";
  }

  if (result.budgetFit < 70 && result.mustHaveFit >= 75) {
    return "Above budget but strong feature fit";
  }

  if (result.budgetFit >= 85 && result.niceToHaveFit < 40) {
    return "Affordable but fewer extras";
  }

  return "Best all-round value";
}

function createReviewsForSchool(school: SchoolRecord, suburb: Suburb, index: number): SchoolReview[] {
  const reviewCount = 3 + (index % 7);

  return Array.from({ length: reviewCount }, (_, reviewIndex) => {
    const overallScore = Math.min(4.9, Math.max(3.3, school.reviewScore + ((reviewIndex % 3) - 1) * 0.1));

    return {
      id: `${school.slug}-review-${reviewIndex + 1}`,
      schoolSlug: school.slug,
      reviewerAlias: `${aliasPrefixes[reviewIndex % aliasPrefixes.length]} ${suburb.name}`,
      overallScore: round(overallScore),
      headline: reviewHeadlines[(index + reviewIndex) % reviewHeadlines.length],
      body: reviewBodies[(index + reviewIndex) % reviewBodies.length],
      pros: [
        reviewPros[(index + reviewIndex) % reviewPros.length],
        reviewPros[(index + reviewIndex + 1) % reviewPros.length],
      ],
      cons: [reviewCons[(index + reviewIndex) % reviewCons.length]],
      gradeRelevantToReview: schoolCoverage.gradesFrom,
      dimensionScores: {
        overallSatisfaction: round(overallScore),
        valueForMoney: round(Math.max(3, overallScore - 0.1)),
        communication: round(Math.min(5, overallScore + 0.1)),
        facilities: round(Math.max(3.2, overallScore - 0.2)),
        sportsAndActivities: round(Math.max(3.1, overallScore - 0.1)),
        aftercareQuality: round(Math.max(3, overallScore - 0.2)),
        safetyAndCleanliness: round(Math.min(5, overallScore + 0.2)),
        childHappiness: round(Math.min(5, overallScore + 0.1)),
      },
      createdAt: new Date(Date.UTC(2026, reviewIndex % 3, 5 + index)).toISOString(),
      isSimulated: true,
    };
  });
}

function buildLocalSchoolRecords(): SchoolRecord[] {
  return midrandSchoolSeeds.map((seed, index) => {
    const suburb = midrandSuburbs.find((item) => item.slug === seed.suburbSlug);

    if (!suburb) {
      throw new Error(`Unknown suburb: ${seed.suburbSlug}`);
    }

    const latitude = suburb.latitude + seed.latitudeOffset;
    const longitude = suburb.longitude + seed.longitudeOffset;
    const reviewScore = round(3.6 + ((index * 37) % 12) / 10);

    return {
      id: `school-${index + 1}`,
      name: seed.name,
      slug: slugify(seed.name),
      suburbSlug: suburb.slug,
      schoolType: seed.schoolType,
      gradesFrom: schoolCoverage.gradesFrom,
      gradesTo: schoolCoverage.gradesTo,
      annualFeeMin: seed.annualFeeMin,
      annualFeeMax: seed.annualFeeMax,
      monthlyEstimate: roundWhole(seed.annualFeeMax / 12),
      registrationFee: seed.registrationFee,
      depositFee: seed.depositFee,
      aftercareAvailable: seed.aftercareAvailable,
      transportAvailable: seed.transportAvailable,
      swimmingAvailable: seed.swimmingAvailable,
      sports: seed.sports,
      facilities: seed.facilities,
      mustHaveFeatures: seed.mustHaveFeatures,
      niceToHaveFeatures: seed.niceToHaveFeatures,
      curriculum: seed.curriculum,
      religiousAffiliation: seed.religiousAffiliation,
      classSizeEstimate: seed.classSizeEstimate,
      latitude,
      longitude,
      distanceFromSuburbCenterKm: seed.distanceFromSuburbCenterKm,
      reviewScore,
      reviewCount: 3 + (index % 7),
      confidenceLevel: "simulated",
      isSimulated: true,
      lastUpdatedAt: MIDRAND_LAST_UPDATED_AT,
    };
  });
}

const localSchoolRecords = buildLocalSchoolRecords();
const localReviews = localSchoolRecords.flatMap((school, index) => {
  const suburb = midrandSuburbs.find((item) => item.slug === school.suburbSlug);
  return suburb ? createReviewsForSchool(school, suburb, index) : [];
});

function mapDbSchool(row: DbSchoolRow): SchoolRecord {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    suburbSlug: row.suburb_slug,
    schoolType: row.school_type,
    gradesFrom: schoolCoverage.gradesFrom,
    gradesTo: schoolCoverage.gradesTo,
    annualFeeMin: Number(row.annual_fee_min),
    annualFeeMax: Number(row.annual_fee_max),
    monthlyEstimate: Number(row.monthly_estimate),
    registrationFee: Number(row.registration_fee),
    depositFee: Number(row.deposit_fee),
    aftercareAvailable: row.aftercare_available,
    transportAvailable: row.transport_available,
    swimmingAvailable: row.swimming_available,
    sports: row.sports ?? [],
    facilities: row.facilities ?? [],
    mustHaveFeatures: row.must_have_features ?? [],
    niceToHaveFeatures: row.nice_to_have_features ?? [],
    curriculum: row.curriculum,
    religiousAffiliation: row.religious_affiliation ?? undefined,
    classSizeEstimate: row.class_size_estimate,
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    distanceFromSuburbCenterKm: Number(row.distance_from_suburb_center_km),
    reviewScore: Number(row.review_score),
    reviewCount: row.review_count,
    confidenceLevel: row.confidence_level,
    isSimulated: true,
    lastUpdatedAt: row.updated_at,
  };
}

function mapDbReview(row: DbReviewRow): SchoolReview {
  return {
    id: row.id,
    schoolSlug: row.school_slug,
    reviewerAlias: row.reviewer_alias,
    overallScore: Number(row.overall_score),
    headline: row.headline,
    body: row.body,
    pros: row.pros ?? [],
    cons: row.cons ?? [],
    gradeRelevantToReview: row.grade_relevant_to_review as SchoolReview["gradeRelevantToReview"],
    dimensionScores: {
      overallSatisfaction: row.dimension_scores.overallSatisfaction,
      valueForMoney: row.dimension_scores.valueForMoney,
      communication: row.dimension_scores.communication,
      facilities: row.dimension_scores.facilities,
      sportsAndActivities: row.dimension_scores.sportsAndActivities,
      aftercareQuality: row.dimension_scores.aftercareQuality,
      safetyAndCleanliness: row.dimension_scores.safetyAndCleanliness,
      childHappiness: row.dimension_scores.childHappiness,
    },
    createdAt: row.created_at,
    isSimulated: true,
  };
}

async function loadDirectoryFromDatabase() {
  const pool = getServerDbPool();
  const schoolQuery = await pool.query<DbSchoolRow>(
    `select
      s.id,
      s.name,
      s.slug,
      sub.slug as suburb_slug,
      s.school_type,
      s.annual_fee_min,
      s.annual_fee_max,
      s.monthly_estimate,
      s.registration_fee,
      s.deposit_fee,
      s.aftercare_available,
      s.transport_available,
      s.swimming_available,
      s.sports,
      s.facilities,
      s.must_have_features,
      s.nice_to_have_features,
      s.curriculum,
      s.religious_affiliation,
      s.class_size_estimate,
      s.latitude,
      s.longitude,
      s.distance_from_suburb_center_km,
      s.review_score,
      s.review_count,
      s.confidence_level,
      s.updated_at
    from public.schools s
    join public.suburbs sub on sub.id = s.suburb_id
    where s.is_active = true
    order by s.name asc`,
  );

  const reviewQuery = await pool.query<DbReviewRow>(
    `select
      r.id,
      s.slug as school_slug,
      r.reviewer_alias,
      r.overall_score,
      r.headline,
      r.body,
      r.pros,
      r.cons,
      r.grade_relevant_to_review,
      r.dimension_scores,
      r.created_at
    from public.school_reviews r
    join public.schools s on s.id = r.school_id
    order by r.created_at desc`,
  );

  return {
    schools: schoolQuery.rows.map(mapDbSchool),
    reviews: reviewQuery.rows.map(mapDbReview),
  };
}

async function loadDirectory() {
  if (!hasUsableSupabaseDbUrl()) {
    return {
      suburbs: midrandSuburbs,
      schools: localSchoolRecords,
      reviews: localReviews,
      source: "local" as const,
    };
  }

  try {
    const dbDirectory = await loadDirectoryFromDatabase();
    return {
      suburbs: midrandSuburbs,
      schools: dbDirectory.schools,
      reviews: dbDirectory.reviews,
      source: "database" as const,
    };
  } catch {
    return {
      suburbs: midrandSuburbs,
      schools: localSchoolRecords,
      reviews: localReviews,
      source: "local-fallback" as const,
    };
  }
}

export function formatCurrency(value: number) {
  return moneyFormatter.format(value);
}

export function getMidrandSuburbs() {
  return midrandSuburbs;
}

export function getSuburbName(slug: string) {
  return midrandSuburbs.find((item) => item.slug === slug)?.name ?? "Midrand";
}

export function getSchoolTypeLabel(schoolType: SchoolType) {
  return normalizeSchoolTypeLabel(schoolType);
}

export function getDefaultFilters(): MatchFilters {
  return {
    childGrade: "Grade 3",
    budgetType: "monthly",
    budgetValue: 6000,
    homeSuburb: "noordwyk",
    workSuburb: "",
    maxCommute: "under_8_km",
    mustHaveFeatures: ["Aftercare"],
    niceToHaveFeatures: ["Library"],
    schoolType: "both",
  };
}

export async function matchSchools(filters: MatchFilters) {
  const directory = await loadDirectory();
  const annualBudget = annualizeBudget(filters.budgetType, filters.budgetValue);
  const homeSuburb = directory.suburbs.find((item) => item.slug === filters.homeSuburb) ?? directory.suburbs[0];
  const workSuburb = filters.workSuburb
    ? directory.suburbs.find((item) => item.slug === filters.workSuburb)
    : undefined;

  const matches = directory.schools
    .map<MatchResult>((school) => {
      const estimatedAnnualCost = school.annualFeeMax + school.registrationFee + school.depositFee;
      const budgetFit = calculateBudgetFit(estimatedAnnualCost, annualBudget);
      const distanceHome = haversineDistanceKm(homeSuburb.latitude, homeSuburb.longitude, school.latitude, school.longitude);
      const distanceWork = workSuburb
        ? haversineDistanceKm(workSuburb.latitude, workSuburb.longitude, school.latitude, school.longitude)
        : Number.POSITIVE_INFINITY;
      const distanceKm = round(Math.min(distanceHome, distanceWork));
      const distanceFit = calculateDistanceFit(distanceKm, filters.maxCommute);
      const mustHave = calculateMustHaveFit(school, filters.mustHaveFeatures);
      const niceToHaveFit = calculateNiceToHaveFit(school, filters.niceToHaveFeatures);
      const schoolTypeFit = calculateSchoolTypeFit(school.schoolType, filters.schoolType);
      const ratingFit = roundWhole((school.reviewScore / 5) * 100);
      const fitScore = roundWhole(
        budgetFit * 0.35 +
          distanceFit * 0.25 +
          mustHave.score * 0.2 +
          niceToHaveFit * 0.08 +
          schoolTypeFit * 0.05 +
          ratingFit * 0.07,
      );

      const topMatchingFeatures = [...school.mustHaveFeatures, ...school.niceToHaveFeatures]
        .filter((feature, index, list) => list.indexOf(feature) === index)
        .filter((feature) =>
          filters.mustHaveFeatures.includes(feature) || filters.niceToHaveFeatures.includes(feature),
        )
        .slice(0, 3);

      const base = {
        school,
        fitScore,
        estimatedAnnualCost,
        distanceKm,
        topMatchingFeatures,
        missingMustHaves: mustHave.missing,
        budgetFit,
        distanceFit,
        mustHaveFit: mustHave.score,
        niceToHaveFit,
        schoolTypeFit,
        ratingFit,
      };

      return {
        ...base,
        tradeoffLabel: pickTradeoffLabel(base),
      };
    })
    .sort((left, right) => {
      if (right.fitScore !== left.fitScore) {
        return right.fitScore - left.fitScore;
      }

      if (left.school.annualFeeMin !== right.school.annualFeeMin) {
        return left.school.annualFeeMin - right.school.annualFeeMin;
      }

      if (left.distanceKm !== right.distanceKm) {
        return left.distanceKm - right.distanceKm;
      }

      return right.school.reviewScore - left.school.reviewScore;
    });

  return {
    filters,
    annualBudget,
    suburbs: directory.suburbs,
    matches,
    source: directory.source,
  };
}

export async function getSchoolDetail(slug: string): Promise<SchoolDetailPayload | null> {
  const directory = await loadDirectory();
  const school = directory.schools.find((item) => item.slug === slug);

  if (!school) {
    return null;
  }

  const suburb = directory.suburbs.find((item) => item.slug === school.suburbSlug);

  if (!suburb) {
    return null;
  }

  const reviews = directory.reviews.filter((item) => item.schoolSlug === slug).slice(0, 6);
  const similarSchools = directory.schools
    .filter((item) => item.slug !== school.slug)
    .sort((left, right) => {
      const leftDelta = Math.abs(left.annualFeeMin - school.annualFeeMin) + haversineDistanceKm(left.latitude, left.longitude, school.latitude, school.longitude) * 1000;
      const rightDelta = Math.abs(right.annualFeeMin - school.annualFeeMin) + haversineDistanceKm(right.latitude, right.longitude, school.latitude, school.longitude) * 1000;
      return leftDelta - rightDelta;
    })
    .slice(0, 3);

  return {
    school,
    suburb,
    reviews,
    similarSchools,
  };
}

export async function buildCompareRows(slugs: string[], filters: MatchFilters) {
  const matchPayload = await matchSchools(filters);
  const selected = matchPayload.matches.filter((item) => slugs.includes(item.school.slug)).slice(0, 4);

  return selected.map<CompareRow>((item) => ({
    slug: item.school.slug,
    name: item.school.name,
    suburb: getSuburbName(item.school.suburbSlug),
    schoolType: normalizeSchoolTypeLabel(item.school.schoolType),
    annualFee: `${formatCurrency(item.school.annualFeeMin)} - ${formatCurrency(item.school.annualFeeMax)}`,
    monthlyEstimate: formatCurrency(item.school.monthlyEstimate),
    distance: `${item.distanceKm.toFixed(1)} km`,
    aftercare: item.school.aftercareAvailable ? "Yes" : "No",
    transport: item.school.transportAvailable ? "Yes" : "No",
    swimming: item.school.swimmingAvailable ? "Yes" : "No",
    sports: item.school.sports.slice(0, 3).join(", "),
    rating: `${item.school.reviewScore.toFixed(1)} / 5`,
    bestFor: item.topMatchingFeatures[0] ?? item.school.mustHaveFeatures[0] ?? "Balanced fit",
    tradeoff: item.tradeoffLabel,
  }));
}

```

FILE: lib/affordable-schools/query.ts
```ts
﻿import { CHILD_GRADES, FEATURES, MAX_COMMUTE_OPTIONS, SCHOOL_TYPE_PREFERENCES, type Feature, type MatchFilters } from "@/lib/affordable-schools/types";
import { getDefaultFilters } from "@/lib/affordable-schools/shared";

function asFeatureList(value: string | undefined): Feature[] {
  if (!value) {
    return [];
  }

  const allowed = new Set<string>(FEATURES);

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is Feature => allowed.has(item));
}

export function parseFiltersFromSearchParams(searchParams: URLSearchParams | Record<string, string | string[] | undefined>) {
  const defaults = getDefaultFilters();
  const getValue = (key: string) => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }

    const raw = searchParams[key];
    if (Array.isArray(raw)) {
      return raw[0];
    }

    return raw;
  };

  const childGrade = getValue("child_grade");
  const budgetType = getValue("budget_type");
  const budgetValue = Number(getValue("budget_value") ?? defaults.budgetValue);
  const homeSuburb = getValue("home_suburb");
  const workSuburb = getValue("work_suburb");
  const maxCommute = getValue("max_commute");
  const schoolType = getValue("school_type");

  return {
    childGrade: CHILD_GRADES.find((item) => item === childGrade) ?? defaults.childGrade,
    budgetType: budgetType === "annual" ? "annual" : defaults.budgetType,
    budgetValue: Number.isFinite(budgetValue) && budgetValue > 0 ? budgetValue : defaults.budgetValue,
    homeSuburb: homeSuburb && homeSuburb.length > 0 ? homeSuburb : defaults.homeSuburb,
    workSuburb: workSuburb && workSuburb.length > 0 ? workSuburb : "",
    maxCommute: MAX_COMMUTE_OPTIONS.find((item) => item === maxCommute) ?? defaults.maxCommute,
    mustHaveFeatures: asFeatureList(getValue("must_have_features")),
    niceToHaveFeatures: asFeatureList(getValue("nice_to_have_features")),
    schoolType: SCHOOL_TYPE_PREFERENCES.find((item) => item === schoolType) ?? defaults.schoolType,
  } satisfies MatchFilters;
}

export function serializeFilters(filters: MatchFilters) {
  const params = new URLSearchParams();
  params.set("child_grade", filters.childGrade);
  params.set("budget_type", filters.budgetType);
  params.set("budget_value", String(filters.budgetValue));
  params.set("home_suburb", filters.homeSuburb);

  if (filters.workSuburb) {
    params.set("work_suburb", filters.workSuburb);
  }

  params.set("max_commute", filters.maxCommute);
  params.set("school_type", filters.schoolType);

  if (filters.mustHaveFeatures.length > 0) {
    params.set("must_have_features", filters.mustHaveFeatures.join(","));
  }

  if (filters.niceToHaveFeatures.length > 0) {
    params.set("nice_to_have_features", filters.niceToHaveFeatures.join(","));
  }

  return params.toString();
}


```

FILE: lib/affordable-schools/shared.ts
```ts
﻿import { midrandSuburbs } from "@/lib/affordable-schools/catalog";
import type { MatchFilters, SchoolType } from "@/lib/affordable-schools/types";

const moneyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return moneyFormatter.format(value);
}

export function getMidrandSuburbs() {
  return midrandSuburbs;
}

export function getSuburbName(slug: string) {
  return midrandSuburbs.find((item) => item.slug === slug)?.name ?? "Midrand";
}

export function getSchoolTypeLabel(schoolType: SchoolType) {
  switch (schoolType) {
    case "public":
      return "Public";
    case "private_low_fee":
      return "Private low-fee";
    case "private_mid_tier":
      return "Private mid-tier";
    default:
      return "Private premium";
  }
}

export function getDefaultFilters(): MatchFilters {
  return {
    childGrade: "Grade 3",
    budgetType: "monthly",
    budgetValue: 6000,
    homeSuburb: "noordwyk",
    workSuburb: "",
    maxCommute: "under_8_km",
    mustHaveFeatures: ["Aftercare"],
    niceToHaveFeatures: ["Library"],
    schoolType: "both",
  };
}

```

FILE: lib/affordable-schools/types.ts
```ts
export const CHILD_GRADES = [
  "Grade R",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
] as const;

export const BUDGET_TYPES = ["monthly", "annual"] as const;
export const SCHOOL_TYPE_PREFERENCES = [
  "private_only",
  "public_only",
  "both",
] as const;
export const MAX_COMMUTE_OPTIONS = [
  "under_3_km",
  "under_5_km",
  "under_8_km",
  "under_12_km",
  "best_within_20_min",
] as const;
export const FEATURES = [
  "Aftercare",
  "Transport",
  "Swimming",
  "Soccer",
  "Rugby",
  "Cricket",
  "Netball",
  "Music",
  "Coding/Robotics",
  "Religious alignment",
  "Small classes",
  "Library",
  "Extra murals",
  "Modern classrooms",
  "Meal option",
  "Holiday care",
  "Sibling discount",
] as const;

export type ChildGrade = (typeof CHILD_GRADES)[number];
export type BudgetType = (typeof BUDGET_TYPES)[number];
export type SchoolTypePreference = (typeof SCHOOL_TYPE_PREFERENCES)[number];
export type MaxCommuteOption = (typeof MAX_COMMUTE_OPTIONS)[number];
export type Feature = (typeof FEATURES)[number];

export type SchoolType =
  | "public"
  | "private_low_fee"
  | "private_mid_tier"
  | "private_premium";

export type MatchFilters = {
  childGrade: ChildGrade;
  budgetType: BudgetType;
  budgetValue: number;
  homeSuburb: string;
  workSuburb?: string;
  maxCommute: MaxCommuteOption;
  mustHaveFeatures: Feature[];
  niceToHaveFeatures: Feature[];
  schoolType: SchoolTypePreference;
};

export type ReviewDimensionScores = {
  overallSatisfaction: number;
  valueForMoney: number;
  communication: number;
  facilities: number;
  sportsAndActivities: number;
  aftercareQuality: number;
  safetyAndCleanliness: number;
  childHappiness: number;
};

export type SchoolReview = {
  id: string;
  schoolSlug: string;
  reviewerAlias: string;
  overallScore: number;
  headline: string;
  body: string;
  pros: string[];
  cons: string[];
  gradeRelevantToReview: ChildGrade;
  dimensionScores: ReviewDimensionScores;
  createdAt: string;
  isSimulated: true;
};

export type Suburb = {
  id: string;
  name: string;
  slug: string;
  medianBudgetBand: string;
  pitch: string;
  latitude: number;
  longitude: number;
};

export type SchoolRecord = {
  id: string;
  name: string;
  slug: string;
  suburbSlug: string;
  schoolType: SchoolType;
  gradesFrom: ChildGrade;
  gradesTo: ChildGrade;
  annualFeeMin: number;
  annualFeeMax: number;
  monthlyEstimate: number;
  registrationFee: number;
  depositFee: number;
  aftercareAvailable: boolean;
  transportAvailable: boolean;
  swimmingAvailable: boolean;
  sports: string[];
  facilities: string[];
  mustHaveFeatures: Feature[];
  niceToHaveFeatures: Feature[];
  curriculum: string;
  religiousAffiliation?: string;
  classSizeEstimate: number;
  latitude: number;
  longitude: number;
  distanceFromSuburbCenterKm: number;
  reviewScore: number;
  reviewCount: number;
  confidenceLevel: "simulated";
  isSimulated: true;
  lastUpdatedAt: string;
};

export type MatchResult = {
  school: SchoolRecord;
  fitScore: number;
  estimatedAnnualCost: number;
  distanceKm: number;
  topMatchingFeatures: Feature[];
  missingMustHaves: Feature[];
  tradeoffLabel: string;
  budgetFit: number;
  distanceFit: number;
  mustHaveFit: number;
  niceToHaveFit: number;
  schoolTypeFit: number;
  ratingFit: number;
};

export type SchoolDetailPayload = {
  school: SchoolRecord;
  suburb: Suburb;
  reviews: SchoolReview[];
  similarSchools: SchoolRecord[];
};

export type CompareRow = {
  slug: string;
  name: string;
  suburb: string;
  schoolType: string;
  annualFee: string;
  monthlyEstimate: string;
  distance: string;
  aftercare: string;
  transport: string;
  swimming: string;
  sports: string;
  rating: string;
  bestFor: string;
  tradeoff: string;
};

```

FILE: lib/db/server.ts
```ts
import { Pool } from "pg";

let pool: Pool | null = null;

function isPlaceholderConnectionString(connectionString: string) {
  return (
    connectionString.includes("[YOUR-PASSWORD]") ||
    connectionString.includes("your-url-encoded-password") ||
    connectionString.includes("your-project-ref")
  );
}

export function hasUsableSupabaseDbUrl() {
  const connectionString = process.env.SUPABASE_DB_URL;

  return Boolean(connectionString && !isPlaceholderConnectionString(connectionString));
}

export function getServerDbPool() {
  const connectionString = process.env.SUPABASE_DB_URL;

  if (!connectionString) {
    throw new Error("Missing required environment variable: SUPABASE_DB_URL");
  }

  if (isPlaceholderConnectionString(connectionString)) {
    throw new Error("SUPABASE_DB_URL still contains the placeholder password.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 5,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    });
  }

  return pool;
}

```

FILE: lib/site.ts
```ts
export function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    const normalizedUrl = siteUrl.replace(/\/+$/, "");

    try {
      return new URL(normalizedUrl).toString().replace(/\/+$/, "");
    } catch {
      return normalizedUrl;
    }
  }

  return "http://localhost:3000";
}

```

FILE: public/robots.txt
```txt
User-agent: *
Allow: /

Sitemap: http://localhost:3000/sitemap.xml

```

DELIVERY INSTRUCTIONS
- Produce the final answer as the definitive internal architecture blueprint for this product team.
- Explicitly decide the fate of each current or proposed suburb page family.
- Include hard thresholds for index, conditional index, noindex, and merge/delete.
- Include a crawl-control plan, launch gate checklist, and implementation roadmap.
- Treat static `midrand` routes, simulated data labels, and the missing high-school family as first-order findings rather than implementation trivia.
```
