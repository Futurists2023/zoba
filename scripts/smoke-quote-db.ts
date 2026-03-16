import { calculateDatabaseQuote } from "@/lib/database-quote-engine";

async function main() {
  const quote = await calculateDatabaseQuote({
    suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
    adults: 1,
    children: 0,
    lifestyleTier: "balanced",
    bedrooms: 1,
    parkingSpaces: 0,
    propertyType: "apartment",
    workDestinationArea: "cbd",
    commuteDaysPerWeek: 3,
    usesUber: true,
    uberTripsPerMonth: 4,
    usesPublicTransport: false,
    schoolType: "none",
    childcare: "none",
    domesticHelp: "none",
    fibreTier: "basic",
    backupPower: "basic",
    netMonthlyIncome: 28000,
  });

  console.log(
    JSON.stringify(
      {
        suburb: quote.suburb,
        monthlySelected: quote.monthly_cost.selected,
        affordability: quote.affordability,
        snapshotVersion: quote.snapshot_version,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
