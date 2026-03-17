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
