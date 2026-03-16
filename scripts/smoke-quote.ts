import { calculateLocalQuote } from "../lib/local-quote-engine";
import { DEFAULT_TEST_SUBURB_ID } from "../lib/quote";

const result = calculateLocalQuote({
  suburbId: DEFAULT_TEST_SUBURB_ID,
  adults: 2,
  children: 1,
  lifestyleTier: "balanced",
  bedrooms: 2,
  parkingSpaces: 1,
  propertyType: "apartment",
  workDestinationArea: "cbd",
  cars: 1,
  commuteDaysPerWeek: 3,
  usesUber: true,
  uberTripsPerMonth: 4,
  usesPublicTransport: false,
  schoolType: "private_mid",
  childcare: "none",
  domesticHelp: "monthly",
  fibreTier: "standard",
  backupPower: "inverter",
  netMonthlyIncome: 60000,
});

console.log(
  JSON.stringify(
    {
      suburb: result.suburb,
      snapshot: result.snapshot_version,
      monthlyMid: result.monthly_cost.mid,
      selectedMonthly: result.monthly_cost.selected,
      workableNetSalary: result.salary_thresholds.workable_net_salary,
      comfortableNetSalary: result.salary_thresholds.comfortable_net_salary,
      affordability: result.affordability,
      confidence: result.confidence,
    },
    null,
    2,
  ),
);
