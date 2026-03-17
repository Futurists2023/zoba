# AffordableSchools — Definitive Architecture & Indexation Blueprint

**Version:** 1.0 · **Date:** 2026-03-17 · **Status:** Pre-launch audit against prototype snapshot

---

## 1. Executive Verdict

| Field | Assessment |
|---|---|
| **National-scale safety** | **Not safe to scale today.** The current codebase is a single-suburb static prototype with simulated data, no dynamic `[suburb]` routing, no high-school inventory, a broken sitemap, hardcoded Midrand canonicals at the layout level, and a `localhost` robots.txt. Scaling this to 3,000 suburbs without the fixes in this blueprint would produce thousands of thin, substantially similar, and technically broken pages. |
| **Defensibility score** | **28 / 100** — The matching engine and shortlist flow are genuinely strong product primitives, but every SEO and crawl-safety layer is either missing, broken, or hardcoded to one suburb. |
| **Top risks** | 1. **Substantial similarity at scale:** `/affordable-schools/[suburb]` and `/affordable-primary-schools/[suburb]` render the identical `LandingPage` component with the same `matchSchools(getDefaultFilters())` payload; the only difference is two sentences of hero copy. At 3,000 suburbs this produces 6,000 near-duplicate pages. 2. **Phantom high-school family:** `/affordable-high-schools/[suburb]` is declared as a target page family but has zero routes, zero data, and zero inventory. Indexing it would create 3,000 empty doorway pages. 3. **Simulated data in the index:** Every school record and review carries `isSimulated: true` and `confidenceLevel: "simulated"`. Indexing pages built entirely on fabricated fees, ratings, and reviews violates Google's helpful-content standard. 4. **Broken crawl signals:** Layout-level canonical points every page to `/affordable-schools/midrand`; sitemap emits 0 URLs in production (the `getSiteUrl()` fallback is `localhost`); `robots.txt` references `localhost`. 5. **No JSON-LD schema markup** on any page. 6. **Cross-linking leak:** The primary-schools page routes all detail/shortlist actions into the `/affordable-schools/midrand/...` namespace, undermining any claim of distinct page identity. |
| **Top strengths** | 1. **Genuine decision-support engine:** The `matchSchools` scoring model (budget 35%, distance 25%, must-haves 20%, nice-to-haves 8%, school-type 5%, rating 7%) is a real parent utility, not a directory list. 2. **Correct noindex discipline on utility pages:** Results, shortlist, compare, and school-detail pages are all explicitly `noindex, nofollow`. 3. **No crawlable filter URLs:** Filters POST to an API route; the indexable landing page does not expose query-string permutations to crawlers. 4. **Shortlist + compare flow** is a genuinely differentiated product feature that no generic directory offers. 5. **Clean separation of concerns** between engine, query parsing, catalog, and components. |

---

## 2. Route Family Decisions

### 2.1 `/affordable-schools/[suburb]` — Broad suburb hub

| Field | Value |
|---|---|
| **Route pattern** | `/affordable-schools/[suburb]` |
| **Purpose** | Entry page for parents searching "affordable schools in [suburb]" |
| **User job** | "Show me all affordable schools near me so I can start narrowing down." |
| **Unique value** | Aggregates primary AND high-school inventory into one ranked, filterable view with budget/commute/feature matching. |
| **Overlap with siblings** | **Critical overlap today.** Because the catalog contains only Grade R–7 schools, this page renders the exact same inventory as the primary-schools page. The `LandingPage` component calls `matchSchools(getDefaultFilters())` identically for both variants; the only delta is two sentences of hero/guide copy. |
| **Doorway risk** | **Medium-high at scale.** If 3,000 suburbs each get this page with <3 schools and identical template copy differing only by suburb name, Google will classify them as doorway pages. |
| **Scaled content risk** | **High today** due to simulated data. **Medium when real data exists**, provided inventory thresholds are enforced. |
| **Thin content risk** | **High.** Many suburbs will have ≤2 schools. A "matching engine" page with 1–2 results provides no comparison value. |
| **Default action** | **Conditional index.** This is the strongest candidate for the primary indexable page per suburb, but only when it has enough real inventory to justify existence. |
| **Indexation conditions** | See §3 Suburb Threshold Model. |
| **Merge targets** | When a suburb has only primary schools, this page IS the primary page in practice. Do not also index `/affordable-primary-schools/[suburb]`. |
| **Notes** | Must carry distinct content from the stage-specific pages: it must show BOTH primary and high-school cards when both exist, with a stage toggle or grouped layout. If a suburb has only one stage, this page should be the sole indexed page and the stage-specific URL should canonical to it. |

### 2.2 `/affordable-primary-schools/[suburb]` — Primary-school leaf

| Field | Value |
|---|---|
| **Route pattern** | `/affordable-primary-schools/[suburb]` |
| **Purpose** | Targeted page for parents searching "affordable primary schools in [suburb]" |
| **User job** | "Show me only primary schools so I can compare Grade R–7 options." |
| **Unique value** | **Zero unique value today.** Renders the same component, same data, same default filters, same school cards as the broad hub. The `variant="primary"` flag changes only two copy strings. |
| **Overlap with siblings** | **Near-total overlap with `/affordable-schools/[suburb]`** in the current implementation. |
| **Doorway risk** | **High.** At 3,000 suburbs, this creates 3,000 additional pages that are substantially identical to their hub siblings. This is textbook doorway/scaled-content abuse. |
| **Scaled content risk** | **High.** |
| **Thin content risk** | **High** for suburbs with ≤3 primary schools. |
| **Default action** | **Conditional index — only when the suburb has ≥5 primary schools AND the broad hub also contains high-school inventory, making the primary page a genuinely distinct filtered view.** Otherwise: `noindex` with `canonical` pointing to `/affordable-schools/[suburb]`. |
| **Indexation conditions** | See §3. |
| **Merge targets** | Canonicalize to `/affordable-schools/[suburb]` whenever the suburb has no high-school inventory or has <5 primary schools. |
| **Notes** | To earn indexation, this page MUST filter the engine to primary-only results server-side, show primary-specific comparison modules (e.g., Grade R readiness checklist, foundation-phase fee bands), and NOT route users into the `/affordable-schools/` namespace for detail/shortlist. |

### 2.3 `/affordable-high-schools/[suburb]` — High-school leaf

| Field | Value |
|---|---|
| **Route pattern** | `/affordable-high-schools/[suburb]` |
| **Purpose** | Targeted page for parents searching "affordable high schools in [suburb]" |
| **User job** | "Show me only high schools so I can compare Grade 8–12 options." |
| **Unique value** | **Does not exist.** No route, no component, no data, no inventory. |
| **Overlap with siblings** | N/A — cannot overlap because it has no content. |
| **Doorway risk** | **Maximum.** Indexing a page family with zero inventory is the definition of a doorway page. |
| **Scaled content risk** | **Maximum.** |
| **Thin content risk** | **Maximum.** |
| **Default action** | **Do not build or index until high-school inventory exists.** |
| **Indexation conditions** | Same thresholds as primary leaf (see §3), applied to high-school records. |
| **Merge targets** | N/A. |
| **Notes** | When high-school data is eventually sourced, the same conditional-index rules apply. The broad hub page should be updated first to include high-school cards; the leaf page earns indexation only when it provides a distinct filtered view. |

### 2.4 `/affordable-schools/[suburb]/results` — Filtered results

| Field | Value |
|---|---|
| **Default action** | **Noindex, nofollow** (already correct). |
| **Notes** | Utility page. Must never be indexed. Current implementation is correct. |

### 2.5 `/affordable-schools/[suburb]/shortlist` — Shortlist review

| Field | Value |
|---|---|
| **Default action** | **Noindex, nofollow** (already correct). |
| **Notes** | Session-specific utility. Correct as-is. |

### 2.6 `/affordable-schools/[suburb]/compare` — Compare redirect

| Field | Value |
|---|---|
| **Default action** | **Noindex, nofollow** (already correct). |
| **Notes** | Redirect shim. Correct as-is. |

### 2.7 `/affordable-schools/[suburb]/schools/[slug]` — School detail

| Field | Value |
|---|---|
| **Default action** | **Noindex, nofollow** (already correct for simulated data). |
| **Notes** | When real verified data replaces simulated data, this page family becomes a strong candidate for conditional indexation (one indexed profile per school). That decision is out of scope until `isSimulated` is removed. |

### 2.8 `/` — Root

| Field | Value |
|---|---|
| **Default action** | **Redirect to a national landing page** (not to a single suburb). Current redirect to `/affordable-schools/midrand` is prototype-only. |

### 2.9 `/api/*` — API routes

| Field | Value |
|---|---|
| **Default action** | **Disallow in robots.txt.** Non-page assets. |

---

## 3. Suburb Threshold Model

### 3.1 Hard thresholds

| Condition | Pages eligible for indexation | Action for ineligible pages |
|---|---|---|
| **Total schools in suburb ≥ 5, with real (non-simulated) data** | `/affordable-schools/[suburb]` may be indexed | If <5 schools or all simulated: `noindex`, do not include in sitemap |
| **Total schools in suburb ≥ 8, AND primary schools ≥ 5, AND high schools ≥ 3** | `/affordable-schools/[suburb]` + `/affordable-primary-schools/[suburb]` may both be indexed | If high-school count is 0: primary leaf canonicalizes to broad hub |
| **Total schools ≥ 10, AND primary ≥ 5, AND high ≥ 5** | All three pages may be indexed | Full three-page suburb |
| **Total schools 3–4, real data** | `/affordable-schools/[suburb]` only, conditionally | Must pass template-quality checks (§4) |
| **Total schools ≤ 2** | **Zero indexed pages** | `noindex` all; suburb appears only as a row in a parent city/region hub page |
| **All data is simulated** | **Zero indexed pages for any suburb** | Hard gate. No simulated-data page may be indexed. |

### 3.2 Minimum comparison count

A page earns indexation only if it can show **≥3 schools that a parent can meaningfully compare** (i.e., different schools, not the same school listed under variant names). The shortlist/compare flow requires ≥2 schools to function; the page needs ≥3 to provide genuine comparison value.

### 3.3 Minimum unique modules

Each indexed page must render **at least 4 of these 6 modules** with real, suburb-specific data:

1. **Fee-band summary** — median/range of annual fees for schools in this suburb
2. **Live filter + ranked school cards** — the matching engine with ≥3 results
3. **Suburb context block** — real geographic, demographic, or school-landscape facts (NOT filler lifestyle copy)
4. **Stage-specific guidance** (for leaf pages) — e.g., foundation-phase readiness checklist, matric pass-rate context
5. **Affordability differentiation** — how this suburb's fee landscape compares to the broader city/region
6. **Shortlist CTA with comparison table preview**

### 3.4 Minimum affordability differentiation

The page must contain at least one data point that distinguishes this suburb's affordability profile from neighboring suburbs. If the fee range, school-type mix, and feature availability are identical to an adjacent suburb, the two suburbs should be merged into a single page or one should canonical to the other.

### 3.5 Automatic noindex conditions

Apply `noindex` automatically when ANY of these are true:

- `schoolCount < 3`
- `allSchoolsSimulated === true`
- `uniqueSchoolTypes < 2` AND `schoolCount < 5` (no comparison diversity)
- `pageModulesRendered < 4`
- `feeRangeSpread === 0` (all schools have identical fees — no comparison value)
- Suburb has been flagged as a geographic alias of another suburb (e.g., "Halfway Gardens" vs. "Halfway House")

### 3.6 Automatic merge conditions

Merge (canonical) the stage-specific leaf into the broad hub when:

- The suburb has schools of only one stage (primary-only or high-only)
- The stage-specific page has <5 schools of that stage
- The broad hub and the leaf would render identical school cards

---

## 4. Template Requirements

### 4.1 `/affordable-schools/[suburb]` (Broad hub)

| Field | Requirement |
|---|---|
| **Required modules** | Fee-band summary, live filter + ranked cards (showing BOTH stages), suburb context block, affordability differentiation vs. region, shortlist CTA |
| **Forbidden patterns** | Generic lifestyle filler ("Midrand is a vibrant suburb..."), identical copy blocks across suburbs differing only by suburb name, simulated reviews rendered as if real, school cards that link into a different suburb's namespace |
| **Must-have unique data** | Real school inventory, real fee data, suburb-specific fee-band stats, school count by type |
| **Must-have internal links** | Link to stage-specific leaf pages (when they are indexed), link to parent city/region hub, breadcrumb trail |
| **Trust labels** | Data freshness date, "Verified school data" or "Simulated — not yet verified" badge, source attribution |
| **Notes** | When both primary and high schools exist, the page MUST visually separate or toggle between stages. It cannot just dump all cards into one undifferentiated list — that would make it a weaker version of both leaf pages. |

### 4.2 `/affordable-primary-schools/[suburb]` (Primary leaf)

| Field | Requirement |
|---|---|
| **Required modules** | Primary-only ranked cards (server-filtered to Grade R–7), foundation-phase fee-band summary, primary-specific guidance module, shortlist CTA |
| **Forbidden patterns** | Rendering high-school cards, routing detail/shortlist into `/affordable-schools/` namespace, identical hero copy to the broad hub |
| **Must-have unique data** | Primary-only fee stats, primary school count, at least one primary-specific content module not present on the hub |
| **Must-have internal links** | Breadcrumb to broad hub, link to high-school leaf (if indexed), link to city/region hub |
| **Trust labels** | Same as hub |
| **Notes** | Detail and shortlist flows MUST stay within `/affordable-primary-schools/[suburb]/...` namespace to maintain page identity. |

### 4.3 `/affordable-high-schools/[suburb]` (High-school leaf — future)

| Field | Requirement |
|---|---|
| **Required modules** | High-school-only ranked cards (Grade 8–12), matric/senior-phase fee-band summary, high-school-specific guidance (e.g., subject offerings, matric context), shortlist CTA |
| **Forbidden patterns** | Same as primary leaf, mutatis mutandis |
| **Must-have unique data** | High-school-only fee stats, high-school count, at least one high-school-specific module |
| **Must-have internal links** | Breadcrumb to broad hub, link to primary leaf (if indexed) |
| **Trust labels** | Same as hub |

---

## 5. Page Family Scoring

### 5.1 `/affordable-schools/[suburb]` — Current state

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Distinct user job | 20 | 14 | 2.8 |
| Affordability decision value | 20 | 15 | 3.0 |
| Inventory depth | 15 | 6 | 0.9 |
| Comparison depth | 15 | 12 | 1.8 |
| Template uniqueness | 10 | 4 | 0.4 |
| Internal hierarchy fit | 5 | 3 | 0.15 |
| Thin content risk (inverse) | 5 | 3 | 0.15 |
| Doorway risk (inverse) | 5 | 4 | 0.2 |
| Scaled content risk (inverse) | 5 | 2 | 0.1 |
| **Total** | **100** | | **9.5 → normalized 47/100** |

**Classification: NOINDEX** (score 47, below conditional-index threshold of 65).

Rationale: The matching engine provides real decision value, but simulated data, single-suburb hardcoding, missing schema, broken canonicals, and near-total overlap with the primary page make this unsafe to index today.

### 5.2 `/affordable-primary-schools/[suburb]` — Current state

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| Distinct user job | 20 | 6 | 1.2 |
| Affordability decision value | 20 | 14 | 2.8 |
| Inventory depth | 15 | 6 | 0.9 |
| Comparison depth | 15 | 12 | 1.8 |
| Template uniqueness | 10 | 2 | 0.2 |
| Internal hierarchy fit | 5 | 2 | 0.1 |
| Thin content risk (inverse) | 5 | 3 | 0.15 |
| Doorway risk (inverse) | 5 | 2 | 0.1 |
| Scaled content risk (inverse) | 5 | 2 | 0.1 |
| **Total** | **100** | | **7.35 → normalized 37/100** |

**Classification: MERGE OR DELETE** (score 37). In its current form, this page has no distinct identity from the hub. It should not exist as a separate indexed page until it has genuinely different content, data, and user flow.

### 5.3 `/affordable-high-schools/[suburb]` — Current state

| Dimension | Weight | Score | Weighted |
|---|---|---|---|
| All dimensions | 100 | 0 | 0 |

**Classification: DELETE / DO NOT BUILD** (score 0). No route, no data, no inventory.

---

## 6. Crawl Control Plan

### 6.1 `robots.txt` rules

```
User-agent: *
Allow: /affordable-schools/
Allow: /affordable-primary-schools/
Allow: /affordable-high-schools/
Disallow: /api/
Disallow: /affordable-schools/*/results
Disallow: /affordable-schools/*/shortlist
Disallow: /affordable-schools/*/compare
Disallow: /affordable-schools/*/schools/

Sitemap: https://www.affordableschools.co.za/sitemap.xml
```

**Critical fix:** Replace `public/robots.txt` static file with a dynamic `app/robots.ts` that uses `getSiteUrl()` with a production `NEXT_PUBLIC_SITE_URL`. The current `localhost` reference is a hard blocker.

### 6.2 Canonical rules

| Page | Canonical |
|---|---|
| `/affordable-schools/[suburb]` | Self-referencing: `/affordable-schools/[suburb]` |
| `/affordable-primary-schools/[suburb]` (indexed) | Self-referencing |
| `/affordable-primary-schools/[suburb]` (below threshold) | Canonical → `/affordable-schools/[suburb]` |
| `/affordable-high-schools/[suburb]` (indexed) | Self-referencing |
| `/affordable-high-schools/[suburb]` (below threshold) | Canonical → `/affordable-schools/[suburb]` |
| All utility pages | Self-referencing + `noindex` |

**Critical fix:** Remove the layout-level `alternates.canonical` in `app/layout.tsx` that hardcodes `/affordable-schools/midrand`. Every page must set its own canonical at the page level. The layout should set only `metadataBase`.

### 6.3 Sitemap rules

- **Dynamic sitemap generation** via `app/sitemap.ts` that queries the database for all suburbs meeting the indexation thresholds.
- Only include URLs that pass the threshold model (§3).
- Separate sitemap indexes if total URLs exceed 10,000.
- `lastModified` must reflect actual data-update timestamps, not `new Date()`.
- `priority` values: broad hub = 0.8, stage leaf = 0.7.
- **Never include** utility pages, API routes, or below-threshold suburbs.

**Critical fix:** Current `app/sitemap.ts` hardcodes two Midrand URLs and uses `getSiteUrl()` which falls back to `localhost`. Replace with a data-driven generator.

### 6.4 Parameter rules

- **No query parameters on indexed pages.** The current architecture correctly uses POST requests for filter updates. Maintain this.
- If any future flow appends query parameters to indexed URLs, those parameters must be handled via `rel="canonical"` pointing to the clean URL.
- `Disallow` any `?schools=` or filter parameter paths in robots.txt as a safety net.

### 6.5 Noindex rules

Apply `<meta name="robots" content="noindex, nofollow">` via Next.js metadata when:

- Suburb fails any threshold in §3.5
- Page is a utility flow (results, shortlist, compare, school detail)
- Data is entirely simulated (`allSchoolsSimulated === true`)
- Page is a below-threshold stage leaf (also set canonical to hub)

Implementation: Create a `getSuburbIndexability(suburbSlug: string)` function that returns `{ indexHub: boolean, indexPrimary: boolean, indexHigh: boolean }` based on live data counts. Each page's `generateMetadata` must call this function.

---

## 7. Implementation Roadmap

### Phase 0: Emergency fixes (before any indexation)

| Priority | Task | Reason | SEO Impact | Product Impact | Complexity |
|---|---|---|---|---|---|
| P0 | **Set `NEXT_PUBLIC_SITE_URL` to production domain; replace static `robots.txt` with dynamic `app/robots.ts`** | Current `localhost` references make the site invisible to crawlers and break all canonical/sitemap URLs | Critical | None | Low |
| P0 | **Remove layout-level `alternates.canonical` from `app/layout.tsx`** | Every page currently inherits a Midrand canonical, which will collapse all future suburb pages into one canonical target | Critical | None | Low |
| P0 | **Add `noindex` to both current Midrand pages until real data replaces simulated data** | Indexing pages built on fabricated fees and reviews violates helpful-content policy | Critical | Low | Low |
| P0 | **Fix sitemap to emit 0 URLs until real data exists** (or remove from robots.txt) | Sitemap currently advertises simulated-data pages | High | None | Low |

### Phase 1: Foundation for national scale

| Priority | Task | Reason | SEO Impact | Product Impact | Complexity |
|---|---|---|---|---|---|
| P1 | **Build dynamic `[suburb]` route for `/affordable-schools/[suburb]`** | Required for any multi-suburb deployment | Critical | Critical | Medium |
| P1 | **Implement `getSuburbIndexability()` function** that queries school counts by stage and returns index/noindex decisions per page family | Enforces threshold model programmatically | Critical | Medium | Medium |
| P1 | **Wire `generateMetadata` in each page to use `getSuburbIndexability()`** for robots and canonical | Prevents thin/duplicate pages from entering the index | Critical | Low | Medium |
| P1 | **Build data-driven `app/sitemap.ts`** that only emits URLs passing thresholds | Crawl efficiency | High | None | Medium |
| P1 | **Source and ingest real school data for first batch of suburbs** | Nothing can be indexed until `isSimulated` is replaced | Critical | Critical | High |
| P1 | **Add JSON-LD `EducationalOrganization` schema** to school detail pages and `ItemList` schema to suburb listing pages | Missing structured data | Medium | Low | Medium |

### Phase 2: Differentiate page families

| Priority | Task | Reason | SEO Impact | Product Impact | Complexity |
|---|---|---|---|---|---|
| P2 | **Make `/affordable-schools/[suburb]` show both stages** with grouped/toggled layout when both primary and high schools exist | This is what makes the broad hub genuinely distinct from the leaf pages | High | High | Medium |
| P2 | **Make `/affordable-primary-schools/[suburb]` server-filter to primary-only** and add primary-specific modules (foundation-phase guidance, Grade R readiness) | Required for the leaf page to earn indexation | High | High | Medium |
| P2 | **Fix cross-linking leak:** primary leaf detail/shortlist flows must stay in `/affordable-primary-schools/[suburb]/...` namespace | Without this, the primary page has no independent identity | High | Medium | Medium |
| P2 | **Add suburb context module** with real data (school count, fee-band stats, comparison to region) | Required template module for indexation | Medium | Medium | Medium |
| P2 | **Add affordability differentiation module** showing how this suburb compares to neighbors | Unique value signal | Medium | High | Medium |
| P2 | **Add cross-links between hub and leaf pages** and breadcrumb navigation | Currently the two indexable pages are siblings with no in-product link path | Medium | Medium | Low |

### Phase 3: High-school expansion

| Priority | Task | Reason | SEO Impact | Product Impact | Complexity |
|---|---|---|---|---|---|
| P3 | **Source high-school inventory** (Grade 8–12 data) | Cannot build the third page family without data | High | High | High |
| P3 | **Build `/affordable-high-schools/[suburb]` route** with high-school-specific modules | New page family | Medium | High | Medium |
| P3 | **Apply same threshold model** to high-school leaf | Consistency | Medium | Low | Low |

### Phase 4: Scale and harden

| Priority | Task | Reason | SEO Impact | Product Impact | Complexity |
|---|---|---|---|---|---|
| P4 | **Build city/region hub pages** (e.g., `/affordable-schools/johannesburg`) that aggregate suburb links | Internal linking hierarchy; catch suburbs with <3 schools | Medium | Medium | Medium |
| P4 | **Implement geographic alias detection** to prevent duplicate suburb pages | Crawl efficiency, duplicate prevention | Medium | Low | Medium |
| P4 | **Add automated thin-page monitoring** that flags suburbs dropping below thresholds | Ongoing quality control | Medium | Low | Medium |
| P4 | **Implement `hreflang` if expanding beyond South Africa** | Future-proofing | Low | Low | Low |

---

## 8. Launch Gate Checklist

| # | Check | Pass/Fail | Owner |
|---|---|---|---|
| 1 | `NEXT_PUBLIC_SITE_URL` set to production domain, not `localhost` | **FAIL** | Engineering |
| 2 | `app/layout.tsx` does NOT set a layout-level canonical | **FAIL** — currently hardcodes `/affordable-schools/midrand` | Engineering |
| 3 | `robots.txt` references production sitemap URL | **FAIL** — references `localhost` | Engineering |
| 4 | `robots.txt` disallows `/api/`, utility pages | **FAIL** — currently `Allow: /` | Engineering |
| 5 | Sitemap emits only URLs that pass threshold model | **FAIL** — hardcodes 2 Midrand URLs | Engineering |
| 6 | Every indexed page has a page-level self-referencing canonical | **FAIL** — primary page has one, but layout override breaks it | Engineering |
| 7 | Every indexed page has `robots: { index: true }` only when thresholds are met | **FAIL** — no threshold logic exists | Engineering |
| 8 | No indexed page renders simulated data without a prominent "simulated" label | **PARTIAL** — labels exist in UI but pages are still indexable | Engineering + Product |
| 9 | No indexed page is built entirely on simulated data | **FAIL** — all data is simulated | Data |
| 10 | `/affordable-schools/[suburb]` shows both stages when both exist | **FAIL** — only primary data exists | Engineering |
| 11 | `/affordable-primary-schools/[suburb]` server-filters to primary-only and has distinct modules | **FAIL** — renders identical payload to hub | Engineering |
| 12 | `/affordable-high-schools/[suburb]` is not built/indexed until high-school data exists | **PASS** — route does not exist | Engineering |
| 13 | JSON-LD schema markup present on all indexed pages | **FAIL** — no schema found | Engineering |
| 14 | Cross-linking between hub and leaf pages exists | **FAIL** — no cross-links | Engineering |
| 15 | Breadcrumb navigation present | **FAIL** — no breadcrumbs | Engineering |
| 16 | Detail/shortlist flows from primary page stay in primary namespace | **FAIL** — routes into `/affordable-schools/` | Engineering |
| 17 | `getSuburbIndexability()` function exists and is called by all page `generateMetadata` | **FAIL** — does not exist | Engineering |
| 18 | Suburbs with ≤2 schools are automatically noindexed | **FAIL** — no logic | Engineering |
| 19 | Geographic alias detection prevents duplicate suburb pages | **FAIL** — no logic | Engineering |
| 20 | Data freshness timestamp is real, not `new Date()` | **FAIL** — sitemap uses `new Date()` | Engineering |

**Overall gate status: BLOCKED. 18 of 20 checks fail. Do not scale to additional suburbs until Phase 0 and Phase 1 are complete.**

---

## 9. The Hard Answers

### Does the broad suburb page do a unique job, or is it just a weaker version of the primary/high pages?

**Today: it is a weaker version.** It renders the same primary-only inventory with a vaguer title. **At target state:** it does a unique job IF it aggregates both stages into a single view with stage grouping, fee-band comparison across stages, and serves the "I don't know which stage to focus on yet" parent. That job is real but requires implementation work that does not exist today.

### Is the primary page genuinely distinct from the high-school page?

**In concept, yes.** A parent searching for primary schools has a different decision context (foundation phase, aftercare importance, Grade R readiness) than a parent searching for high schools (subject choices, matric rates, senior-phase fees). **In implementation, no.** The primary page today is a copy-paste of the hub with two changed sentences.

### Would a parent miss anything important if one of these pages did not exist?

**Today: No.** A parent would lose nothing if the primary page were deleted, because the hub page shows identical content. **At target state:** Yes, if the primary page has primary-specific modules and the hub has a cross-stage view, each serves a distinct need.

### Does the page provide actionable comparison value or just a local list?

**The matching engine provides genuine comparison value** — budget fit scoring, distance ranking, must-have matching, tradeoff labels, and a shortlist/compare flow. This is the platform's strongest asset. The risk is not the engine; it's that the engine is wrapped in near-duplicate page shells with simulated data.

### Is this page one of many substantially similar pages differing only by suburb name?

**At 3,000 suburbs with the current template: yes, definitively.** The template has no suburb-specific data modules beyond the school cards themselves. If two suburbs each have 3 schools with similar fee ranges, the pages will be substantially similar. The threshold model and required modules in this blueprint are designed to prevent this.

---

## 10. Final Architecture Blueprint Summary

```
SAFE TO INDEX (when thresholds met + real data):
  /affordable-schools