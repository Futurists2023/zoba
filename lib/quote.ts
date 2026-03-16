export const DEFAULT_TEST_SUBURB_ID = "22222222-2222-2222-2222-222222222222";

export type QuoteRequest = {
  suburbId: string;
  adults: number;
  children?: number;
  lifestyleTier: "value" | "balanced" | "comfortable";
  bedrooms: number;
  parkingSpaces?: number;
  propertyType?: "apartment" | "townhouse" | "house" | "any";
  housingOverride?: number | null;
  workDestinationArea?:
    | "remote"
    | "cbd"
    | "century_city"
    | "claremont"
    | "bellville"
    | "airport_industria"
    | "somerset_west";
  cars?: number;
  commuteDaysPerWeek?: number;
  usesUber?: boolean;
  uberTripsPerMonth?: number;
  usesPublicTransport?: boolean;
  schoolType?: "none" | "public" | "private_mid" | "private_premium";
  childcare?: "none" | "part_time" | "full_time";
  domesticHelp?: "none" | "monthly" | "weekly" | "twice_weekly" | "full_time";
  medicalAidTier?: "none" | "basic" | "mid" | "premium";
  fibreTier?: "none" | "basic" | "standard" | "fast";
  backupPower?: "none" | "basic" | "inverter" | "full";
  netMonthlyIncome?: number | null;
};

function asNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function asBoolean(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
  }

  return fallback;
}

export function normalizeQuoteRequest(payload: unknown): QuoteRequest {
  const body = (payload ?? {}) as Record<string, unknown>;

  const suburbId =
    typeof body.suburbId === "string" && body.suburbId.trim() !== ""
      ? body.suburbId
      : DEFAULT_TEST_SUBURB_ID;

  return {
    suburbId,
    adults: asNumber(body.adults, 2),
    children: asNumber(body.children, 0),
    lifestyleTier:
      body.lifestyleTier === "value" || body.lifestyleTier === "comfortable"
        ? body.lifestyleTier
        : "balanced",
    bedrooms: asNumber(body.bedrooms, 2),
    parkingSpaces: asNumber(body.parkingSpaces, 1),
    propertyType:
      body.propertyType === "apartment" ||
      body.propertyType === "townhouse" ||
      body.propertyType === "house"
        ? body.propertyType
        : "any",
    housingOverride:
      body.housingOverride === null || body.housingOverride === undefined
        ? null
        : asNumber(body.housingOverride, 0),
    workDestinationArea:
      body.workDestinationArea === "cbd" ||
      body.workDestinationArea === "century_city" ||
      body.workDestinationArea === "claremont" ||
      body.workDestinationArea === "bellville" ||
      body.workDestinationArea === "airport_industria" ||
      body.workDestinationArea === "somerset_west"
        ? body.workDestinationArea
        : "remote",
    cars: asNumber(body.cars, 0),
    commuteDaysPerWeek: asNumber(body.commuteDaysPerWeek, 0),
    usesUber: asBoolean(body.usesUber, false),
    uberTripsPerMonth: asNumber(body.uberTripsPerMonth, 0),
    usesPublicTransport: asBoolean(body.usesPublicTransport, false),
    schoolType:
      body.schoolType === "public" ||
      body.schoolType === "private_mid" ||
      body.schoolType === "private_premium"
        ? body.schoolType
        : "none",
    childcare:
      body.childcare === "part_time" || body.childcare === "full_time"
        ? body.childcare
        : "none",
    domesticHelp:
      body.domesticHelp === "monthly" ||
      body.domesticHelp === "weekly" ||
      body.domesticHelp === "twice_weekly" ||
      body.domesticHelp === "full_time"
        ? body.domesticHelp
        : "none",
    medicalAidTier:
      body.medicalAidTier === "basic" ||
      body.medicalAidTier === "mid" ||
      body.medicalAidTier === "premium"
        ? body.medicalAidTier
        : "none",
    fibreTier:
      body.fibreTier === "basic" ||
      body.fibreTier === "standard" ||
      body.fibreTier === "fast"
        ? body.fibreTier
        : "none",
    backupPower:
      body.backupPower === "basic" ||
      body.backupPower === "inverter" ||
      body.backupPower === "full"
        ? body.backupPower
        : "none",
    netMonthlyIncome:
      body.netMonthlyIncome === null || body.netMonthlyIncome === undefined
        ? null
        : asNumber(body.netMonthlyIncome, 0),
  };
}
