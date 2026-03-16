# Cost of Living MVP Spec

## Product Summary

Working title: `Cape Town Living Cost Planner`

This MVP helps a household estimate what life will actually cost in a specific Cape Town suburb based on its real situation, not city-wide averages.

The product promise:

`Tell us your household, suburb shortlist, and lifestyle choices. We return your likely monthly cost, affordability band, and minimum comfortable net salary.`

This is not another generic "Cape Town is expensive/cheap" site. It is a suburb-level decision tool for people making a real move or budget decision.

## Why This Product Should Exist

Current incumbents are useful, but they leave a meaningful product gap:

- Numbeo is strong for broad city-level cost comparison and salary conversion, but it is still mostly driven by aggregated user-submitted price points and generalized calculators.
- Expatistan is helpful for city-to-city comparisons, but it also remains broad, crowd-influenced, and less suited to suburb-specific household planning.
- Nomad-oriented city platforms are optimized for "Can I live in this city?" and remote-worker lifestyle discovery, not "Can my exact household afford Claremont vs Durbanville vs Blouberg?"

That gap creates the wedge:

`Personalized suburb-level affordability for real households in one city, using blended market data plus explicit local cost modeling.`

## Vision

Become the most trusted place to answer:

`Can I afford this exact life in this exact suburb?`

Long term, the business can expand from Cape Town into other South African metros, then into adjacent use cases like relocation planning, salary benchmarking, and lead generation.

## MVP Objective

Launch a focused Cape Town MVP that proves three things:

1. Users care more about personalized suburb-level planning than generic city averages.
2. We can build a data model accurate enough to be trusted without waiting for perfect data coverage.
3. The planner can drive monetizable intent in categories like rentals, schools, fibre, moving, and medical aid.

## Target Users

Primary users:

- Salaried locals considering a move between Cape Town suburbs
- Semigrating families relocating to Cape Town
- Employers, recruiters, and relocation coordinators benchmarking packages

Secondary users:

- Returning South Africans evaluating affordability
- Young professionals deciding whether to live alone, share, or stay farther out

## Core User Jobs

Users hire this product to:

- Estimate a realistic monthly cost for their actual household
- Compare two or three suburbs before moving
- Understand what salary is needed for a comfortable lifestyle
- Identify which cost categories make a suburb unaffordable

## Example User Story

A couple with one child wants to compare Claremont, Durbanville, and Blouberg. They expect one car, hybrid work, private school, fibre, backup power, and mid-tier medical aid.

The MVP should return:

- Estimated monthly cost in each suburb
- Category-by-category breakdown
- "Minimum comfortable net salary"
- An affordability label such as `stretched`, `workable`, or `comfortable`
- A short explanation of the main tradeoffs by suburb

## Problem Statement

City-level cost-of-living tools flatten too much of the decision:

- Housing differs sharply between suburbs
- Commute costs depend on where you live and how often you travel
- South African household budgets often include line items global products underweight or ignore, such as backup power, domestic help, school choice differences, and local utility structures
- Families do not budget like solo digital nomads

Users do not need another average. They need a scenario engine.

## Why We Can Beat Incumbents

We do not need to beat incumbents on global breadth. We need to beat them on usefulness for a narrow, high-intent decision.

### Positioning Wedge

Compete on:

- `Suburb precision` instead of city averages
- `Household personalization` instead of generic baskets
- `Decision support` instead of reference data
- `South Africa realism` instead of globally normalized assumptions

Do not compete on:

- Global city coverage
- Community features
- Broad digital nomad discovery
- Massive user-contributed databases in v1

### Product Moats

Potential defensibility comes from combining:

- Structured suburb-level housing and transport modeling
- South Africa-specific cost categories
- Versioned pricing snapshots
- User overrides and corrections that improve the model over time
- pSEO pages and comparison pages generated from the same core data model
- Uniqueness controls so only genuinely differentiated pages are indexed
- High-intent lead flow in local service categories

### Why Users May Prefer This

Compared with incumbents, this product can feel more trustworthy for an actual move because it answers:

- "What will my likely rent be in this suburb?"
- "How does commuting from this suburb affect monthly transport?"
- "What changes if I choose private vs public school?"
- "Can I still afford this if I need backup power and medical aid?"

## Feasibility

The MVP is feasible because it does not require perfect automation on day one.

### Data Strategy

Use a blended pricing model with three layers per category:

1. `Observed market price`
2. `Modeled default`
3. `User override`

This lets us ship early, stay transparent, and improve over time.

### Data Sources for V1

Use practical, refreshable sources such as:

- Rental listings for suburb-level housing ranges
- Municipal and utility tariffs for core household overheads
- Grocery basket benchmarks
- Fuel and commute assumptions
- School fee bands
- Fibre package pricing
- Medical aid plan bands
- Domestic worker and childcare benchmarks

### Operational Feasibility

The first version can be maintained with a lightweight operating model:

- Weekly or biweekly price refresh for volatile categories
- Monthly refresh for slower-moving categories
- Manual review of outliers before publishing model updates
- Versioned calculation tables so every result can be traced to a pricing snapshot

This means accuracy can improve without blocking launch.

### Accuracy Strategy

Trust will matter more than "perfect precision." The MVP should:

- Show estimated ranges where confidence is lower
- Explain assumptions clearly
- Allow users to override key values like rent, school, or medical aid
- Separate `market estimate` from `your edited budget`

This avoids overclaiming while still creating value.

## Viability

The idea is commercially viable if it captures users at the moment of relocation or budget planning.

### Monetization Order

Start with lead generation, not subscriptions.

Best early lead categories:

- Rentals
- Broadband
- Moving services
- Schools
- Medical aid
- Insurance

Second monetization layer:

- Premium downloadable affordability report
- Employer relocation reports
- Recruiter salary benchmarking

Third monetization layer:

- Sponsored placement in relevant decision flows
- API or dashboard access for B2B relocation use cases

### Why Leads Work

This product sits close to a purchase decision. Users are not casually browsing lifestyle content; they are trying to solve an immediate affordability problem. That makes traffic lower-volume but higher-intent than generic city-comparison content.

### Core Viability Hypothesis

If users trust the planner enough to compare suburbs and save scenarios, a meaningful share will also click through to housing, connectivity, school, and moving-related offers.

## Scope

Build the MVP around:

- One onboarding flow
- One calculation engine
- One results page
- One suburb comparison view
- Optional email capture to save results

The full journey should take under three minutes.

## In Scope for V1

### Inputs

Household:

- Adults
- Children
- Employment setup
- Lifestyle tier
- Net monthly income

Housing:

- Target suburb
- Rent
- Bedrooms
- Parking need
- Home type if available

Mobility:

- Number of cars
- Commute days per week
- Work destination area
- Uber/public transport usage

Family:

- School type
- Childcare need
- Domestic help frequency

Household overhead:

- Medical aid tier
- Fibre tier
- Mobile tier
- Backup power need

### Outputs

- Total estimated monthly cost
- Category breakdown
- Comfortable net salary estimate
- Affordability label
- Comparison across up to three suburbs
- Short "what drives the difference" explanation

## Out of Scope for V1

- Multiple cities
- Public home-buying estimates
- Community-contributed editing tools
- Full account systems
- Full property search marketplace
- Salary tax optimization engine
- Long-form financial planning
- AI chat assistant

## Product Requirements

### Core Experience

The user must be able to:

1. Enter household details once
2. Select up to three suburbs
3. View cost estimates and salary guidance
4. Adjust key assumptions
5. Save or email the result

### UX Principles

- Fast enough for first value in under three minutes
- Transparent about assumptions
- Useful even if the user only knows a rough target suburb
- More practical than pretty

## Calculation Model

Each scenario should calculate:

`Total monthly cost = housing + transport + groceries + utilities + connectivity + education/childcare + healthcare + domestic help + discretionary buffer`

The engine should also calculate:

- `Minimum comfortable net salary`
- `Housing share of budget`
- `Transport burden`
- `Difference between suburbs by category`

Use ranges where exactness is weak, especially early in the product.

Implementation judgment for MVP:

- Grocery estimates stay suburb-neutral in v1 and vary by household size and lifestyle tier
- Work destination uses fixed area buckets rather than free text
- Range output is mandatory on the total result and optional by category where confidence supports it

## Data Model

Minimum entities:

- `suburbs`
- `pricing_snapshots`
- `housing_costs`
- `transport_costs`
- `household_profiles`
- `school_fee_bands`
- `medical_aid_bands`
- `connectivity_bands`
- `scenario_inputs`
- `scenario_results`

Each result should reference:

- Pricing snapshot version
- Formula version
- Confidence level by category

## Suggested Stack

- `Next.js` for web app and landing pages
- `Supabase/Postgres` for structured pricing tables and saved scenarios
- Versioned calculation engine in application code
- Analytics for funnel and scenario behavior

## Go-To-Market

The GTM strategy should mirror the wedge.

### Distribution Channels

- Local SEO pages for suburb affordability queries
- Comparison pages like "Claremont vs Durbanville cost of living"
- Social content and relocation explainers
- Partnerships with recruiters, relocation firms, and property operators

### SEO Angle

Compete on long-tail, high-intent search instead of broad "cost of living in Cape Town" terms alone.

Examples:

- `cost of living in Claremont for a family`
- `salary needed to live in Durbanville`
- `best Cape Town suburb for commuting and school budget`

### pSEO Defensibility

Programmatic SEO should be baked into the product architecture, not layered on later.

The platform should generate pages from live pricing snapshots and scenario logic, including:

- suburb pages
- suburb comparison pages
- audience pages such as families and remote workers
- suburb plus audience pages only when the modeled outputs differ enough to justify indexing

Each page should include:

- current estimate bands
- key cost drivers
- scenario examples
- assumption transparency
- pricing freshness

Do not publish thin pages with little differentiation. If a page lacks enough unique modeled value or confidence, it should stay out of the index.

## Success Metrics for the First 90 Days

- Calculator completion rate
- Email capture rate
- Scenario save rate
- Suburb comparison usage rate
- Lead click-through rate by category
- Repeat usage within 30 days

## Risks

### Product Risks

- Users may expect false precision
- Data freshness may decay trust
- Too many inputs may reduce completion rate

### Market Risks

- Incumbents could add more personalization
- SEO may take time to mature
- User acquisition may be expensive without strong local content

### Mitigations

- Show assumptions and ranges clearly
- Start narrow with Cape Town only
- Keep the calculator short and bias toward defaults
- Focus on categories incumbents handle poorly
- Treat saved scenarios and comparison use as leading indicators of trust

## Launch Plan

### Phase 1

- Build core data tables
- Ship calculator and results page
- Support 15 to 30 Cape Town suburbs
- Refresh pricing manually on a defined cadence
- Launch rent-first public experience
- Generate suburb and comparison pSEO pages from the same pricing model

### Phase 2

- Add saved scenarios
- Improve explanation layer
- Expand lead categories
- Add more suburb landing pages

### Phase 3

- Add more metros
- Launch employer/recruiter reports
- Introduce premium exports or B2B tools

## One-Sentence MVP Thesis

`Win by being the most useful tool for a real Cape Town household move, not the biggest database of generic cost-of-living averages.`

## Supporting Market Notes

- Numbeo's public product centers on broad cost-of-living comparison and calculator flows rather than suburb-level household planning: https://www.numbeo.com/cost-of-living/calculator.jsp
- Expatistan focuses on city comparison and relocation-style estimates: https://www.expatistan.com/cost-of-living
- Nomad-oriented city platforms present city-level remote-work lifestyle data rather than household suburb planning: https://nomads.com/cost-of-living/cape-town
- Cape Town utility and household overhead modeling can be grounded in official municipal tariff structures: https://www.capetown.gov.za/Family%20and%20home/residential-utility-services/residential-electricity-services/the-cost-of-electricity
