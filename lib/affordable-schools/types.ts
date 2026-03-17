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
