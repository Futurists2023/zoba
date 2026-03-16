export type ConfidenceLevel = "low" | "medium" | "high";
export type PropertyType = "apartment" | "townhouse" | "house" | "any";
export type WorkDestinationArea =
  | "remote"
  | "cbd"
  | "century_city"
  | "claremont"
  | "bellville"
  | "airport_industria"
  | "somerset_west";
export type CostBandCategory =
  | "grocery"
  | "medical_aid"
  | "fibre"
  | "mobile"
  | "school"
  | "childcare"
  | "domestic_help"
  | "backup_power"
  | "utilities";
export type UnitKind =
  | "monthly_household"
  | "monthly_adult"
  | "monthly_child"
  | "monthly_line_item";

type Suburb = {
  id: string;
  name: string;
  slug: string;
  city: string;
  regionGroup: string;
  summary: string;
  standoutFeature: string;
};

type HousingCost = {
  suburbId: string;
  propertyType: PropertyType;
  bedrooms: number;
  parkingSpaces: number;
  lowValue: number;
  midValue: number;
  highValue: number;
  confidence: ConfidenceLevel;
};

type TransportCost = {
  suburbId: string;
  workDestinationArea: WorkDestinationArea;
  roundTripKm: number;
  perKmRate: number;
  carFixedBand: number;
  publicTransportBand: number;
  uberTripBand: number;
  confidence: ConfidenceLevel;
};

type CostBand = {
  category: CostBandCategory;
  segmentKey: string;
  subsegmentKey?: string;
  adultCount?: number;
  childCount?: number;
  unitKind: UnitKind;
  lowValue: number;
  midValue: number;
  highValue: number;
  confidence: ConfidenceLevel;
};

export const localDataset = {
  snapshot: {
    id: "11111111-1111-1111-1111-111111111111",
    versionLabel: "2026-03-cape-town-v1",
    snapshotDate: "2026-03-16",
    notes: "Initial Cape Town MVP snapshot stored locally for testing.",
  },
  suburbs: [
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Claremont",
      slug: "claremont",
      city: "Cape Town",
      regionGroup: "southern_suburbs",
      summary:
        "Dense, family-friendly southern suburbs node with strong schools, rail-bus options, and quick access to the CBD.",
      standoutFeature: "About 14 km from Table Mountain and strong on schools.",
    },
    {
      id: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      name: "Observatory",
      slug: "observatory",
      city: "Cape Town",
      regionGroup: "city_bowl_edge",
      summary:
        "Creative, youthful inner-city fringe suburb with nightlife, older apartments, and quick access to town.",
      standoutFeature: "One of the easiest Cape Town suburbs for a short CBD commute.",
    },
    {
      id: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      name: "Table View",
      slug: "table-view",
      city: "Cape Town",
      regionGroup: "western_seaboard",
      summary:
        "Beachside value pocket with more space than the inner city and a strong remote-work lifestyle appeal.",
      standoutFeature: "Known for better space-for-rent value near the beachfront.",
    },
    {
      id: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      name: "Bellville",
      slug: "bellville",
      city: "Cape Town",
      regionGroup: "northern_suburbs",
      summary:
        "Northern suburbs workhorse with practical pricing, business access, and family-scale housing stock.",
      standoutFeature: "Often one of the cheaper entry points for Cape Town family rentals.",
    },
  ] satisfies Suburb[],
  housingCosts: [
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      propertyType: "apartment",
      bedrooms: 1,
      parkingSpaces: 1,
      lowValue: 12000,
      midValue: 14000,
      highValue: 16500,
      confidence: "high",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      propertyType: "apartment",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 18000,
      midValue: 21000,
      highValue: 25000,
      confidence: "high",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      propertyType: "townhouse",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 22000,
      midValue: 26000,
      highValue: 31000,
      confidence: "medium",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      propertyType: "house",
      bedrooms: 3,
      parkingSpaces: 2,
      lowValue: 30000,
      midValue: 36000,
      highValue: 43000,
      confidence: "medium",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      propertyType: "house",
      bedrooms: 4,
      parkingSpaces: 2,
      lowValue: 42000,
      midValue: 50000,
      highValue: 62000,
      confidence: "medium",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      propertyType: "apartment",
      bedrooms: 1,
      parkingSpaces: 0,
      lowValue: 9000,
      midValue: 11000,
      highValue: 13500,
      confidence: "medium",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      propertyType: "apartment",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 13000,
      midValue: 15500,
      highValue: 19000,
      confidence: "medium",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      propertyType: "townhouse",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 16000,
      midValue: 19000,
      highValue: 23000,
      confidence: "low",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      propertyType: "house",
      bedrooms: 3,
      parkingSpaces: 2,
      lowValue: 22000,
      midValue: 27000,
      highValue: 33000,
      confidence: "low",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      propertyType: "house",
      bedrooms: 4,
      parkingSpaces: 2,
      lowValue: 28000,
      midValue: 34000,
      highValue: 42000,
      confidence: "low",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      propertyType: "apartment",
      bedrooms: 1,
      parkingSpaces: 1,
      lowValue: 9500,
      midValue: 11500,
      highValue: 14000,
      confidence: "medium",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      propertyType: "apartment",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 13500,
      midValue: 16500,
      highValue: 20000,
      confidence: "medium",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      propertyType: "townhouse",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 17000,
      midValue: 20500,
      highValue: 24500,
      confidence: "medium",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      propertyType: "house",
      bedrooms: 3,
      parkingSpaces: 2,
      lowValue: 23000,
      midValue: 28000,
      highValue: 34000,
      confidence: "medium",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      propertyType: "house",
      bedrooms: 4,
      parkingSpaces: 2,
      lowValue: 30000,
      midValue: 36000,
      highValue: 44000,
      confidence: "medium",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      propertyType: "apartment",
      bedrooms: 1,
      parkingSpaces: 1,
      lowValue: 8000,
      midValue: 9800,
      highValue: 11800,
      confidence: "high",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      propertyType: "apartment",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 11000,
      midValue: 13500,
      highValue: 16500,
      confidence: "high",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      propertyType: "townhouse",
      bedrooms: 2,
      parkingSpaces: 1,
      lowValue: 14000,
      midValue: 17000,
      highValue: 21000,
      confidence: "medium",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      propertyType: "house",
      bedrooms: 3,
      parkingSpaces: 2,
      lowValue: 18000,
      midValue: 22500,
      highValue: 27500,
      confidence: "medium",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      propertyType: "house",
      bedrooms: 4,
      parkingSpaces: 2,
      lowValue: 24000,
      midValue: 29500,
      highValue: 36000,
      confidence: "medium",
    },
  ] satisfies HousingCost[],
  transportCosts: [
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      workDestinationArea: "cbd",
      roundTripKm: 16,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1200,
      uberTripBand: 140,
      confidence: "high",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      workDestinationArea: "century_city",
      roundTripKm: 32,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1500,
      uberTripBand: 220,
      confidence: "medium",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      workDestinationArea: "claremont",
      roundTripKm: 4,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 400,
      uberTripBand: 60,
      confidence: "high",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      workDestinationArea: "bellville",
      roundTripKm: 44,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1700,
      uberTripBand: 260,
      confidence: "medium",
    },
    {
      suburbId: "22222222-2222-2222-2222-222222222222",
      workDestinationArea: "remote",
      roundTripKm: 0,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 0,
      uberTripBand: 80,
      confidence: "high",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      workDestinationArea: "cbd",
      roundTripKm: 8,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 900,
      uberTripBand: 110,
      confidence: "high",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      workDestinationArea: "century_city",
      roundTripKm: 22,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1350,
      uberTripBand: 180,
      confidence: "medium",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      workDestinationArea: "claremont",
      roundTripKm: 12,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 850,
      uberTripBand: 120,
      confidence: "medium",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      workDestinationArea: "bellville",
      roundTripKm: 30,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1450,
      uberTripBand: 210,
      confidence: "medium",
    },
    {
      suburbId: "70b49d94-abd3-0856-dc87-3ef946b78b46",
      workDestinationArea: "remote",
      roundTripKm: 0,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 0,
      uberTripBand: 85,
      confidence: "high",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      workDestinationArea: "cbd",
      roundTripKm: 34,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1550,
      uberTripBand: 240,
      confidence: "medium",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      workDestinationArea: "century_city",
      roundTripKm: 26,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1350,
      uberTripBand: 190,
      confidence: "medium",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      workDestinationArea: "claremont",
      roundTripKm: 44,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1700,
      uberTripBand: 280,
      confidence: "low",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      workDestinationArea: "bellville",
      roundTripKm: 42,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1650,
      uberTripBand: 260,
      confidence: "medium",
    },
    {
      suburbId: "985c32e4-396e-9819-8aaa-d83253a7bfc4",
      workDestinationArea: "remote",
      roundTripKm: 0,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 0,
      uberTripBand: 90,
      confidence: "high",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      workDestinationArea: "cbd",
      roundTripKm: 44,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1700,
      uberTripBand: 260,
      confidence: "medium",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      workDestinationArea: "century_city",
      roundTripKm: 28,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1400,
      uberTripBand: 200,
      confidence: "medium",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      workDestinationArea: "claremont",
      roundTripKm: 46,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 1750,
      uberTripBand: 280,
      confidence: "low",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      workDestinationArea: "bellville",
      roundTripKm: 6,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 450,
      uberTripBand: 70,
      confidence: "high",
    },
    {
      suburbId: "6ff666ec-9ddf-3d14-f493-035f196ea1d1",
      workDestinationArea: "remote",
      roundTripKm: 0,
      perKmRate: 4.85,
      carFixedBand: 3500,
      publicTransportBand: 0,
      uberTripBand: 75,
      confidence: "high",
    },
  ] satisfies TransportCost[],
  costBands: [
    { category: "grocery", segmentKey: "base", adultCount: 1, childCount: 0, unitKind: "monthly_household", lowValue: 3500, midValue: 4200, highValue: 5000, confidence: "medium" },
    { category: "grocery", segmentKey: "base", adultCount: 2, childCount: 0, unitKind: "monthly_household", lowValue: 6500, midValue: 7800, highValue: 9200, confidence: "medium" },
    { category: "grocery", segmentKey: "base", adultCount: 2, childCount: 1, unitKind: "monthly_household", lowValue: 8200, midValue: 9600, highValue: 11200, confidence: "medium" },
    { category: "grocery", segmentKey: "base", adultCount: 2, childCount: 2, unitKind: "monthly_household", lowValue: 9800, midValue: 11600, highValue: 13600, confidence: "medium" },
    { category: "utilities", segmentKey: "base", adultCount: 1, childCount: 0, unitKind: "monthly_household", lowValue: 1400, midValue: 1800, highValue: 2300, confidence: "medium" },
    { category: "utilities", segmentKey: "base", adultCount: 2, childCount: 0, unitKind: "monthly_household", lowValue: 1900, midValue: 2400, highValue: 3000, confidence: "medium" },
    { category: "utilities", segmentKey: "base", adultCount: 2, childCount: 1, unitKind: "monthly_household", lowValue: 2300, midValue: 2900, highValue: 3600, confidence: "medium" },
    { category: "medical_aid", segmentKey: "basic", subsegmentKey: "adult", unitKind: "monthly_adult", lowValue: 1700, midValue: 2100, highValue: 2500, confidence: "medium" },
    { category: "medical_aid", segmentKey: "basic", subsegmentKey: "child", unitKind: "monthly_child", lowValue: 850, midValue: 1050, highValue: 1250, confidence: "medium" },
    { category: "medical_aid", segmentKey: "mid", subsegmentKey: "adult", unitKind: "monthly_adult", lowValue: 2500, midValue: 3200, highValue: 3900, confidence: "medium" },
    { category: "medical_aid", segmentKey: "mid", subsegmentKey: "child", unitKind: "monthly_child", lowValue: 1200, midValue: 1500, highValue: 1900, confidence: "medium" },
    { category: "medical_aid", segmentKey: "premium", subsegmentKey: "adult", unitKind: "monthly_adult", lowValue: 4200, midValue: 5200, highValue: 6500, confidence: "medium" },
    { category: "medical_aid", segmentKey: "premium", subsegmentKey: "child", unitKind: "monthly_child", lowValue: 2200, midValue: 2800, highValue: 3400, confidence: "medium" },
    { category: "fibre", segmentKey: "none", unitKind: "monthly_household", lowValue: 0, midValue: 0, highValue: 0, confidence: "high" },
    { category: "fibre", segmentKey: "basic", unitKind: "monthly_household", lowValue: 599, midValue: 699, highValue: 799, confidence: "high" },
    { category: "fibre", segmentKey: "standard", unitKind: "monthly_household", lowValue: 799, midValue: 999, highValue: 1199, confidence: "high" },
    { category: "fibre", segmentKey: "fast", unitKind: "monthly_household", lowValue: 1099, midValue: 1299, highValue: 1499, confidence: "high" },
    { category: "mobile", segmentKey: "basic", unitKind: "monthly_adult", lowValue: 199, midValue: 249, highValue: 299, confidence: "high" },
    { category: "mobile", segmentKey: "standard", unitKind: "monthly_adult", lowValue: 399, midValue: 499, highValue: 599, confidence: "high" },
    { category: "mobile", segmentKey: "heavy", unitKind: "monthly_adult", lowValue: 699, midValue: 849, highValue: 999, confidence: "high" },
    { category: "school", segmentKey: "none", unitKind: "monthly_child", lowValue: 0, midValue: 0, highValue: 0, confidence: "high" },
    { category: "school", segmentKey: "public", unitKind: "monthly_child", lowValue: 1500, midValue: 2000, highValue: 2500, confidence: "medium" },
    { category: "school", segmentKey: "private_mid", unitKind: "monthly_child", lowValue: 4500, midValue: 6500, highValue: 8500, confidence: "medium" },
    { category: "school", segmentKey: "private_premium", unitKind: "monthly_child", lowValue: 10000, midValue: 14000, highValue: 18000, confidence: "medium" },
    { category: "childcare", segmentKey: "none", unitKind: "monthly_child", lowValue: 0, midValue: 0, highValue: 0, confidence: "high" },
    { category: "childcare", segmentKey: "part_time", unitKind: "monthly_child", lowValue: 2500, midValue: 4000, highValue: 5500, confidence: "medium" },
    { category: "childcare", segmentKey: "full_time", unitKind: "monthly_child", lowValue: 6000, midValue: 8500, highValue: 11000, confidence: "medium" },
    { category: "domestic_help", segmentKey: "none", unitKind: "monthly_household", lowValue: 0, midValue: 0, highValue: 0, confidence: "high" },
    { category: "domestic_help", segmentKey: "monthly", unitKind: "monthly_household", lowValue: 450, midValue: 700, highValue: 900, confidence: "medium" },
    { category: "domestic_help", segmentKey: "weekly", unitKind: "monthly_household", lowValue: 1600, midValue: 2200, highValue: 2800, confidence: "medium" },
    { category: "domestic_help", segmentKey: "twice_weekly", unitKind: "monthly_household", lowValue: 3200, midValue: 4200, highValue: 5200, confidence: "medium" },
    { category: "domestic_help", segmentKey: "full_time", unitKind: "monthly_household", lowValue: 6500, midValue: 8000, highValue: 9800, confidence: "medium" },
    { category: "backup_power", segmentKey: "none", unitKind: "monthly_household", lowValue: 0, midValue: 0, highValue: 0, confidence: "high" },
    { category: "backup_power", segmentKey: "basic", unitKind: "monthly_household", lowValue: 150, midValue: 300, highValue: 450, confidence: "medium" },
    { category: "backup_power", segmentKey: "inverter", unitKind: "monthly_household", lowValue: 900, midValue: 1400, highValue: 2000, confidence: "medium" },
    { category: "backup_power", segmentKey: "full", unitKind: "monthly_household", lowValue: 2200, midValue: 3200, highValue: 4500, confidence: "medium" },
  ] satisfies CostBand[],
};
