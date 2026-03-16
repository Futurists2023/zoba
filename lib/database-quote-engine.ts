import { getServerDbPool } from "@/lib/db/server";
import { type QuoteRequest } from "@/lib/quote";

export type QuoteResult = {
  snapshot_id: string;
  snapshot_version: string;
  suburb: string;
  suburb_slug: string;
  monthly_cost: {
    low: number;
    mid: number;
    high: number;
    selected: number;
  };
  categories: Record<string, number>;
  salary_thresholds: {
    workable_net_salary: number;
    comfortable_net_salary: number;
    discretionary_rate: number;
    resilience_rate: number;
  };
  affordability: "stretched" | "workable" | "comfortable" | null;
  confidence: Record<string, "low" | "medium" | "high">;
  assumptions: Record<string, string | number | null>;
  drivers: string[];
};

export async function calculateDatabaseQuote(
  request: QuoteRequest,
): Promise<QuoteResult> {
  const pool = getServerDbPool();

  const cars =
    request.usesPublicTransport || (request.commuteDaysPerWeek ?? 0) === 0 ? 0 : 1;

  const result = await pool.query<{ quote: QuoteResult }>(
    `select public.calculate_suburb_quote(
      p_suburb_id := $1::uuid,
      p_adults := $2::smallint,
      p_children := $3::smallint,
      p_lifestyle_tier := $4::public.lifestyle_tier,
      p_bedrooms := $5::smallint,
      p_parking_spaces := $6::smallint,
      p_property_type := $7::public.property_type,
      p_housing_override := $8::numeric,
      p_work_destination_area := $9::public.work_destination_area,
      p_cars := $10::smallint,
      p_commute_days_per_week := $11::smallint,
      p_uses_uber := $12::boolean,
      p_uber_trips_per_month := $13::smallint,
      p_uses_public_transport := $14::boolean,
      p_school_type := $15::public.school_type,
      p_childcare := $16::public.childcare_type,
      p_domestic_help := $17::public.domestic_help_frequency,
      p_medical_aid_tier := $18::public.medical_aid_tier,
      p_fibre_tier := $19::public.fibre_tier,
      p_mobile_tier := $20::public.mobile_tier,
      p_backup_power := $21::public.backup_power_tier,
      p_net_monthly_income := $22::numeric
    ) as quote`,
    [
      request.suburbId,
      request.adults,
      request.children ?? 0,
      request.lifestyleTier,
      request.bedrooms,
      request.parkingSpaces ?? 0,
      request.propertyType ?? "any",
      request.housingOverride,
      request.workDestinationArea ?? "remote",
      cars,
      request.commuteDaysPerWeek ?? 0,
      request.usesUber ?? false,
      request.uberTripsPerMonth ?? 0,
      request.usesPublicTransport ?? false,
      request.schoolType ?? "none",
      request.childcare ?? "none",
      request.domesticHelp ?? "none",
      "none",
      request.fibreTier ?? "none",
      "basic",
      request.backupPower ?? "none",
      request.netMonthlyIncome,
    ],
  );

  const quote = result.rows[0]?.quote;

  if (!quote) {
    throw new Error("No quote was returned from the database.");
  }

  return quote;
}
