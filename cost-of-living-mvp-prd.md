# Cost of Living MVP PRD

## Document Status

- Product: `Cape Town Living Cost Planner`
- Stage: `MVP PRD`
- Market: `Cape Town, South Africa`
- Date: `2026-03-16`

## 1. Purpose

This PRD translates the MVP spec into a build-ready product definition.

The MVP should help a user answer one practical question:

`Can my household afford life in this Cape Town suburb, and what net salary would make it comfortable?`

## 2. Product Goal

Deliver a web calculator that:

- collects a user's household and lifestyle assumptions in under three minutes
- estimates monthly living costs for one to three Cape Town suburbs
- explains the major cost drivers
- converts the result into a practical affordability signal
- captures high-intent users for follow-up or partner leads

## 3. Success Criteria

The MVP is successful if it proves:

1. Users complete the calculator at a healthy rate.
2. Users care enough to compare suburbs and adjust assumptions.
3. The output is trusted enough to drive save, email, or lead-click behavior.

## 4. Primary Users

### 4.1 Salaried Local Mover

Someone already living in South Africa who is comparing suburbs before moving.

### 4.2 Semigrating Family

A family moving to Cape Town that needs realistic housing, schooling, commute, and household overhead estimates.

### 4.3 Recruiter or Relocation Coordinator

Someone benchmarking whether a package is practical for a candidate moving to Cape Town.

## 5. Jobs To Be Done

Users hire the product to:

- estimate likely monthly costs in a specific suburb
- compare suburbs on the same household assumptions
- understand what salary is needed for a workable or comfortable life
- identify which variables are driving cost pressure

## 6. Non-Goals

The MVP will not:

- support cities beyond Cape Town
- provide full tax planning
- provide public home-buying estimates in the first public release
- replace a property portal
- provide real-time property inventory
- rely on a community editing system
- operate as a full personal finance app

## 7. Product Principles

- `Fast`: first useful result in under three minutes
- `Transparent`: assumptions are visible and editable
- `Localized`: South African household realities are first-class inputs
- `Decision-oriented`: every output should help a move decision
- `Honest`: show ranges and confidence instead of fake precision

## 8. Core User Flow

1. User lands on calculator or suburb comparison page.
2. User enters household details.
3. User selects one to three suburbs.
4. User completes housing, transport, family, and overhead inputs.
5. System calculates monthly cost range, salary guidance, and affordability band.
6. User edits assumptions if needed.
7. User saves, emails, or clicks to a relevant partner category.

## 9. Functional Scope

### 9.1 MVP Screens

- Landing page
- Calculator flow
- Results page
- Suburb comparison table
- Save/email capture modal

### 9.2 Key Actions

- start a scenario
- select up to three suburbs
- edit major assumptions
- compare suburb outputs side by side
- save or email results
- click out to lead categories

## 10. Input Specification

The calculator should use defaults aggressively so the user is not blocked by unknown values.

### 10.1 Household Inputs

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `adults` | integer | yes | range `1-6`, default `1` |
| `children` | integer | yes | range `0-6`, default `0` |
| `life_stage` | enum | yes | `solo`, `couple`, `family`, `shared_household` |
| `employment_setup` | enum | yes | `office`, `hybrid`, `remote`, `mixed` |
| `net_monthly_income` | currency | no | used for affordability label |
| `lifestyle_tier` | enum | yes | `value`, `balanced`, `comfortable` |

### 10.2 Suburb Inputs

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `suburbs` | array | yes | `1-3` selected suburbs |
| `work_destination_area` | enum/string | no | e.g. `CBD`, `Century City`, `Bellville`, `Claremont`, `remote` |

### 10.3 Housing Inputs

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `housing_mode` | enum | yes | public MVP supports `rent` only |
| `bedrooms` | integer | yes | range `0-6` |
| `parking_spaces` | integer | no | default `0` |
| `property_type` | enum | no | `apartment`, `townhouse`, `house`, `any` |
| `housing_override` | currency | no | explicit user monthly housing cost |

### 10.4 Mobility Inputs

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `cars` | integer | yes | range `0-4`, default `0` |
| `commute_days_per_week` | integer | yes | range `0-7`, default based on employment setup |
| `uses_uber` | boolean | yes | default `false` |
| `uber_trips_per_month` | integer | no | only shown if `uses_uber = true` |
| `uses_public_transport` | boolean | yes | default `false` |

### 10.5 Family Inputs

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `school_type` | enum | conditional | `none`, `public`, `private_mid`, `private_premium` |
| `childcare` | enum | conditional | `none`, `part_time`, `full_time` |
| `domestic_help` | enum | yes | `none`, `monthly`, `weekly`, `twice_weekly`, `full_time` |

### 10.6 Household Overhead Inputs

| Field | Type | Required | Notes |
| :-- | :-- | :-- | :-- |
| `medical_aid_tier` | enum | yes | `none`, `basic`, `mid`, `premium` |
| `fibre_tier` | enum | yes | `none`, `basic`, `standard`, `fast` |
| `mobile_tier` | enum | yes | `basic`, `standard`, `heavy` |
| `backup_power` | enum | yes | `none`, `basic`, `inverter`, `full` |

## 11. Output Specification

### 11.1 Primary Outputs

- estimated monthly cost per suburb
- low and high range where needed
- category breakdown
- minimum workable net salary
- minimum comfortable net salary
- affordability band

### 11.2 Secondary Outputs

- cost delta between suburbs
- top three cost drivers
- editable scenario assumptions
- confidence indicator by major category

## 12. Affordability Logic

If the user enters `net_monthly_income`, the product should return:

- `stretched`
- `workable`
- `comfortable`

### 12.1 Definitions

- `stretched`: net income is below workable threshold
- `workable`: net income is above workable threshold but below comfortable threshold
- `comfortable`: net income is at or above comfortable threshold

### 12.2 Formula

Let:

- `essential_cost` = housing + transport + groceries + utilities + connectivity + education/childcare + healthcare
- `support_cost` = domestic help + backup power + mobile + other selected overheads
- `base_total` = essential_cost + support_cost
- `discretionary_buffer` = `base_total * discretionary_rate`
- `resilience_buffer` = `base_total * resilience_rate`

Default rates by lifestyle tier:

| Lifestyle Tier | Discretionary Rate | Resilience Rate |
| :-- | :-- | :-- |
| `value` | `5%` | `5%` |
| `balanced` | `10%` | `8%` |
| `comfortable` | `15%` | `10%` |

Then:

- `workable_net_salary = base_total + resilience_buffer`
- `comfortable_net_salary = base_total + discretionary_buffer + resilience_buffer`

Rationale:

- `workable` means the household can cover modeled recurring costs with some breathing room.
- `comfortable` means the household can cover modeled costs and still absorb discretionary and contingency pressure.

## 13. Calculation Rules

### 13.1 Housing Cost

If `housing_override` exists:

- use override as the monthly housing cost

Else:

- select rent or ownership band by suburb, property type, and bedroom count
- use tier-aware estimate:
  - `value` -> use lower quartile or lower bound
  - `balanced` -> use median estimate
  - `comfortable` -> use upper-middle estimate

Public MVP decision:

- ship `rent` only in the first public release
- keep the schema extensible for `buy` in phase 2
- avoid exposing ownership estimates until source coverage and confidence are strong enough

### 13.2 Transport Cost

Monthly transport cost should include:

- fuel or commute variable cost for each car
- fixed car allowance band per car
- public transport band if selected
- Uber monthly estimate if selected

Suggested MVP transport formula:

`transport_cost = car_fixed_cost + car_variable_cost + public_transport_cost + uber_cost`

Where:

- `car_fixed_cost = cars * suburb_car_fixed_band`
- `car_variable_cost = commute_km_monthly * per_km_rate`
- `commute_km_monthly = round_trip_distance * commute_days_per_week * 4.3`
- `per_km_rate` is a modeled rate including fuel plus wear proxy

### 13.3 Groceries

Start with a household-size grocery basket baseline.

Formula:

`grocery_cost = grocery_base_by_household_size * grocery_lifestyle_multiplier`

Suggested lifestyle multipliers:

- `value = 0.9`
- `balanced = 1.0`
- `comfortable = 1.15`

### 13.4 Utilities

Utilities should include:

- electricity
- water and refuse proxy

Formula:

`utilities_cost = electricity_band + municipal_services_band`

Utilities should be adjusted by:

- household size
- property type if available
- backup power selection if relevant

### 13.5 Schooling and Childcare

If children = `0`, default both to `0`.

If children > `0`:

- `public` -> public school fee band
- `private_mid` -> private mid-market band
- `private_premium` -> premium band
- `childcare` adds part-time or full-time monthly band

### 13.6 Medical Aid

Medical aid cost should be calculated as:

`adult_count * adult_rate + child_count * child_rate`

using the selected plan tier.

### 13.7 Connectivity

Connectivity should include:

- fibre package band
- mobile package band

### 13.8 Domestic Help

Domestic help should use frequency bands and household-size modifiers.

### 13.9 Backup Power

Backup power can be modeled as:

- `none = 0`
- `basic = small monthly allowance for ad hoc solutions`
- `inverter = monthlyized equipment and upkeep proxy`
- `full = higher monthlyized resilience proxy`

## 14. Confidence Scoring

Every major category should carry a confidence level:

- `high`
- `medium`
- `low`

### 14.1 Confidence Rules

`high`:

- current suburb-specific source data exists
- last refresh within expected cadence
- category based on direct observed pricing

`medium`:

- city-level or nearby-suburb data is adjusted into a modeled estimate
- last refresh still acceptable

`low`:

- estimate is heavily inferred
- source data is sparse or stale

### 14.2 Result Confidence

The scenario should show:

- overall confidence
- category confidence

Overall confidence can default to the lowest confidence among high-weight categories:

- housing
- transport
- schooling
- medical aid

## 15. Data Refresh Rules

| Category | Refresh Cadence | Notes |
| :-- | :-- | :-- |
| housing | weekly | rental market moves fastest |
| fuel/transport assumptions | weekly or biweekly | depends on source process |
| utilities | monthly or when tariff changes | often stable within tariff period |
| fibre/mobile | monthly | plans change periodically |
| school fees | termly or annual | slow-moving |
| medical aid bands | annual with plan updates | can be versioned yearly |
| domestic help/childcare | monthly or quarterly | can be modeled from benchmarks |

## 16. Data Model

### 16.1 Core Tables

#### `suburbs`

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `name` | text | suburb name |
| `slug` | text | SEO slug |
| `city` | text | fixed to Cape Town in MVP |
| `region_group` | text | e.g. southern suburbs, northern suburbs |
| `is_active` | boolean | calculator availability |

#### `pricing_snapshots`

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `snapshot_date` | date | snapshot effective date |
| `version_label` | text | human-readable version |
| `notes` | text | update notes |
| `is_live` | boolean | active version flag |

#### `housing_costs`

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `snapshot_id` | uuid | FK to pricing snapshot |
| `suburb_id` | uuid | FK |
| `housing_mode` | text | public MVP uses `rent`; schema remains extensible |
| `property_type` | text | `apartment`, `townhouse`, `house`, `any` |
| `bedrooms` | integer | bedroom count |
| `low_value` | numeric | lower estimate |
| `mid_value` | numeric | median estimate |
| `high_value` | numeric | higher estimate |
| `confidence` | text | `high`, `medium`, `low` |
| `source_count` | integer | source coverage |

#### `transport_costs`

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `snapshot_id` | uuid | FK |
| `suburb_id` | uuid | FK |
| `work_destination_area` | text | destination bucket |
| `round_trip_km` | numeric | modeled commute distance |
| `car_fixed_band` | numeric | fixed monthly car proxy |
| `public_transport_band` | numeric | public transport estimate |
| `uber_trip_band` | numeric | average trip cost |
| `confidence` | text | confidence |

#### `cost_bands`

Use one generalized table for categories that do not require suburb-specific structure.

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `snapshot_id` | uuid | FK |
| `category` | text | e.g. `grocery`, `medical_aid`, `fibre`, `mobile`, `school`, `childcare`, `domestic_help`, `backup_power`, `utilities` |
| `segment_key` | text | tier or profile key |
| `adult_count` | integer | nullable |
| `child_count` | integer | nullable |
| `low_value` | numeric | lower estimate |
| `mid_value` | numeric | median estimate |
| `high_value` | numeric | higher estimate |
| `confidence` | text | confidence |

#### `scenario_inputs`

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `session_id` | text | anonymous or authenticated |
| `input_json` | jsonb | raw normalized inputs |
| `created_at` | timestamptz | created timestamp |

#### `scenario_results`

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `scenario_input_id` | uuid | FK |
| `snapshot_id` | uuid | FK |
| `formula_version` | text | calculation engine version |
| `result_json` | jsonb | full response payload |
| `created_at` | timestamptz | created timestamp |

#### `seo_page_snapshots`

This table supports programmatic SEO pages backed by pricing and scenario logic instead of thin templated copy.

| Column | Type | Notes |
| :-- | :-- | :-- |
| `id` | uuid | primary key |
| `snapshot_id` | uuid | FK |
| `page_type` | text | `suburb`, `comparison`, `audience`, `audience_suburb` |
| `slug` | text | canonical route slug |
| `entity_keys` | jsonb | suburb ids, audience key, or comparison pair |
| `summary_json` | jsonb | precomputed facts, ranges, drivers, and FAQs |
| `uniqueness_score` | numeric | content quality guardrail |
| `published_at` | timestamptz | publication timestamp |
| `is_indexable` | boolean | index control |

## 17. API Shape

### 17.1 `POST /api/scenario/calculate`

Request:

- normalized scenario inputs

Response:

- per-suburb totals
- category breakdown
- salary thresholds
- affordability labels
- confidence indicators

### 17.2 `POST /api/scenario/save`

Request:

- scenario input id
- email

Response:

- save status
- return token or share link

### 17.3 `GET /api/suburbs`

Response:

- active suburb list
- metadata for search/autocomplete

## 18. Result Payload Example

```json
{
  "suburb": "Claremont",
  "monthly_cost": {
    "low": 48200,
    "mid": 53600,
    "high": 60100
  },
  "categories": {
    "housing": 23500,
    "transport": 5200,
    "groceries": 7800,
    "utilities": 2900,
    "schooling_childcare": 8400,
    "healthcare": 3900,
    "connectivity": 1200,
    "domestic_help": 700
  },
  "salary_thresholds": {
    "workable_net_salary": 57900,
    "comfortable_net_salary": 63200
  },
  "affordability": "workable",
  "confidence": {
    "overall": "medium",
    "housing": "high",
    "transport": "medium",
    "schooling_childcare": "medium"
  },
  "drivers": [
    "Housing is the largest cost driver in Claremont.",
    "Private schooling meaningfully increases the family budget.",
    "Transport remains moderate because the commute is hybrid."
  ]
}
```

## 19. UX Requirements

### 19.1 Calculator Flow

- use progressive disclosure
- collect only the minimum needed for first result
- push advanced detail into optional edits after the first result when possible

### 19.2 Result Page

Must show:

- total monthly estimate
- low to high range
- affordability band
- category breakdown chart or table
- suburb comparison table
- editable assumptions
- save/email CTA
- contextual partner CTA

### 19.3 Copy Requirements

The interface should avoid claims like:

- `exact monthly cost`
- `guaranteed affordability`

Prefer language like:

- `estimated monthly cost`
- `based on current modeled market data`
- `adjust assumptions to reflect your real situation`

## 20. Analytics Events

Track at minimum:

- `calculator_started`
- `calculator_completed`
- `suburb_selected`
- `comparison_viewed`
- `assumption_edited`
- `scenario_saved`
- `email_submitted`
- `lead_clicked`

## 21. SEO and Landing Architecture

Use the same structured data to generate:

- suburb pages
- suburb comparison pages
- audience-specific landing pages
- audience plus suburb pages where the data meaningfully differs

Examples:

- `/cape-town/claremont-cost-of-living`
- `/cape-town/durbanville-cost-of-living`
- `/compare/claremont-vs-blouberg-cost-of-living`
- `/for-families/cape-town-cost-of-living`
- `/cape-town/claremont-cost-of-living-for-families`

Each page should contain:

- summary estimate bands
- common household scenarios
- a calculator CTA
- relevant partner CTA

## 22. pSEO Defensibility Requirements

Programmatic SEO should be a product output of the core data model, not a separate content farm.

### 22.1 What Makes Pages Defensible

Every indexable page should include unique, computed value such as:

- current suburb-specific rent bands
- modeled commute implications for key work hubs
- household-specific scenario examples
- affordability thresholds
- top local cost drivers
- pricing snapshot freshness

This creates pages that are difficult to clone without the underlying pricing system, suburb structure, and scenario engine.

### 22.2 Core pSEO Page Types

Launch only page types backed by meaningful differentiation:

- suburb pages
- suburb comparison pages
- audience pages for high-intent groups like families and remote workers
- audience plus suburb pages only when the page passes uniqueness thresholds

### 22.3 Quality Guardrails

Do not publish a page unless:

- it has current snapshot-backed data
- it contains at least one scenario-specific estimate block
- it contains at least one computed insight or tradeoff
- it is materially different from sibling pages

Noindex or avoid generating pages when:

- source coverage is too sparse
- comparison pages have near-identical outputs
- audience variation does not materially change the model

### 22.4 Internal Linking

The platform should automatically link between:

- suburb pages and comparison pages
- suburb pages and relevant audience pages
- result pages and matching landing pages
- pages that share work destination or household patterns

This should create a dense, useful internal graph rather than a flat list of pages.

### 22.5 Freshness and Trust Signals

Every SEO page should surface:

- last pricing snapshot date
- confidence level
- key assumptions
- calculator entry point

These signals improve trust and help distinguish the content from generic AI-generated locality pages.

### 22.6 Moat Hypothesis

The defensible pSEO moat comes from combining:

- structured Cape Town suburb data
- scenario-based calculations
- freshness infrastructure
- page-level uniqueness controls
- high-intent comparison and relocation queries

## 23. Lead Strategy

Initial lead slots should map directly to cost pressure points:

- rentals
- fibre
- schools
- moving services
- medical aid

Lead CTAs should appear after value is delivered, not before.

## 24. Launch Constraints

The MVP should launch with:

- 15 to 30 supported suburbs
- one live calculation engine version
- one pricing snapshot process
- one save/email flow
- no account requirement
- rent-first public release
- programmatic suburb and comparison pages tied to the live pricing snapshot

## 25. Acceptance Criteria

The MVP is ready to ship when:

1. A user can complete the calculator and receive a result for at least 15 active suburbs.
2. The result includes monthly cost, salary thresholds, affordability band, and category breakdown.
3. The result clearly indicates assumptions and confidence.
4. The user can compare up to three suburbs side by side.
5. The user can edit at least housing, school, medical aid, and transport assumptions after first result.
6. Scenario save or email capture works.
7. Pricing snapshot version and formula version are stored with each scenario result.
8. Analytics events fire for the core funnel.
9. Indexable suburb and comparison pages are generated from the live data model.
10. Pages with insufficient uniqueness or confidence are excluded from indexing.

## 26. Recommended Build Sequence

1. Create suburb, pricing snapshot, and cost band tables.
2. Seed 15 to 30 suburbs with housing and transport data.
3. Implement calculation engine with versioning.
4. Build calculator flow with defaults.
5. Build results page and comparison table.
6. Add save/email capture.
7. Add analytics and partner click tracking.
8. Add pSEO page generation, uniqueness scoring, and index controls.
9. Add suburb and comparison landing pages powered by the same data.

## 27. Product Decisions Locked

The following implementation decisions are now fixed for MVP:

- `buy` is excluded from the first public release; the schema stays extensible for phase 2
- grocery pricing is suburb-neutral in MVP and varies by household size and lifestyle tier, not by suburb
- work destination areas use fixed buckets in MVP for cleaner transport modeling and SEO structure
- range output is required on the total result and optional by category where confidence supports it

Rationale:

- this keeps the first release honest and easier to operate
- it avoids thin or weakly supported ownership estimates
- it limits false precision in grocery modeling
- it creates cleaner reusable primitives for comparison pages and internal linking

## 28. MVP Thesis

`The product wins if it becomes more useful than generic city averages at the exact moment a household is deciding where and how to live in Cape Town.`
