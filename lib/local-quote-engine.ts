import { localDataset, type ConfidenceLevel } from "@/data/cape-town-v1";
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
  confidence: Record<string, ConfidenceLevel>;
  assumptions: Record<string, string | number | null>;
  drivers: string[];
};

type BandSelection = {
  lowValue: number;
  midValue: number;
  highValue: number;
  selectedValue: number;
  confidence: ConfidenceLevel;
};

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function pickModeledValue(lowValue: number, midValue: number, highValue: number, tier: QuoteRequest["lifestyleTier"]) {
  if (tier === "value") {
    return round(lowValue);
  }

  if (tier === "comfortable") {
    return round((midValue + highValue) / 2);
  }

  return round(midValue);
}

function confidenceRank(confidence: ConfidenceLevel) {
  if (confidence === "low") {
    return 1;
  }
  if (confidence === "medium") {
    return 2;
  }
  return 3;
}

function resolveHousing(request: QuoteRequest): BandSelection {
  if (request.housingOverride) {
    return {
      lowValue: request.housingOverride,
      midValue: request.housingOverride,
      highValue: request.housingOverride,
      selectedValue: request.housingOverride,
      confidence: "high",
    };
  }

  const candidates = localDataset.housingCosts
    .filter(
      (item) =>
        item.suburbId === request.suburbId &&
        item.bedrooms === request.bedrooms &&
        (request.propertyType === "any" || item.propertyType === request.propertyType),
    )
    .sort((left, right) => {
      const propertyDelta =
        (left.propertyType === request.propertyType ? 0 : 1) -
        (right.propertyType === request.propertyType ? 0 : 1);
      const parkingDelta =
        Math.abs(left.parkingSpaces - (request.parkingSpaces ?? 0)) -
        Math.abs(right.parkingSpaces - (request.parkingSpaces ?? 0));

      return propertyDelta || parkingDelta;
    });

  const selected = candidates[0];

  if (!selected) {
    throw new Error("No local housing data is available for that scenario.");
  }

  return {
    lowValue: selected.lowValue,
    midValue: selected.midValue,
    highValue: selected.highValue,
    selectedValue: pickModeledValue(
      selected.lowValue,
      selected.midValue,
      selected.highValue,
      request.lifestyleTier,
    ),
    confidence: selected.confidence,
  };
}

function resolveTransport(request: QuoteRequest): BandSelection {
  const source = localDataset.transportCosts.find(
    (item) =>
      item.suburbId === request.suburbId &&
      item.workDestinationArea === (request.workDestinationArea ?? "remote"),
  );

  if (!source) {
    throw new Error("No local transport data is available for that work destination.");
  }

  const driveCommuteCost = request.usesPublicTransport
    ? 0
    : source.roundTripKm * (request.commuteDaysPerWeek ?? 0) * 4.3 * source.perKmRate;
  const publicTransportCost = request.usesPublicTransport ? source.publicTransportBand : 0;
  const uberCost = request.usesUber ? source.uberTripBand * (request.uberTripsPerMonth ?? 0) : 0;
  const midValue = round(driveCommuteCost + publicTransportCost + uberCost);
  const lowValue = round(midValue * 0.92);
  const highValue = round(midValue * 1.08);

  return {
    lowValue,
    midValue,
    highValue,
    selectedValue: pickModeledValue(lowValue, midValue, highValue, request.lifestyleTier),
    confidence: source.confidence,
  };
}

function resolveCostBand(
  category: (typeof localDataset.costBands)[number]["category"],
  segmentKey: string,
  tier: QuoteRequest["lifestyleTier"],
  options?: { subsegmentKey?: string; adults?: number; children?: number },
): BandSelection {
  const candidates = localDataset.costBands
    .filter(
      (item) =>
        item.category === category &&
        item.segmentKey === segmentKey &&
        item.subsegmentKey === options?.subsegmentKey,
    )
    .sort((left, right) => {
      const leftAdultRank =
        options?.adults === undefined
          ? left.adultCount === undefined
            ? 0
            : 1
          : left.adultCount === options.adults
            ? 0
            : left.adultCount === undefined
              ? 1
              : 2;
      const rightAdultRank =
        options?.adults === undefined
          ? right.adultCount === undefined
            ? 0
            : 1
          : right.adultCount === options.adults
            ? 0
            : right.adultCount === undefined
              ? 1
              : 2;
      const leftChildRank =
        options?.children === undefined
          ? left.childCount === undefined
            ? 0
            : 1
          : left.childCount === options.children
            ? 0
            : left.childCount === undefined
              ? 1
              : 2;
      const rightChildRank =
        options?.children === undefined
          ? right.childCount === undefined
            ? 0
            : 1
          : right.childCount === options.children
            ? 0
            : right.childCount === undefined
              ? 1
              : 2;

      if (leftAdultRank !== rightAdultRank) {
        return leftAdultRank - rightAdultRank;
      }

      if (leftChildRank !== rightChildRank) {
        return leftChildRank - rightChildRank;
      }

      return 0;
    });

  const selected = candidates[0];

  if (!selected) {
    throw new Error(`No local ${category} band is available for segment ${segmentKey}.`);
  }

  return {
    lowValue: selected.lowValue,
    midValue: selected.midValue,
    highValue: selected.highValue,
    selectedValue: pickModeledValue(
      selected.lowValue,
      selected.midValue,
      selected.highValue,
      tier,
    ),
    confidence: selected.confidence,
  };
}

function calculateSalaryThresholds(baseTotal: number, tier: QuoteRequest["lifestyleTier"]) {
  const discretionaryRate = tier === "value" ? 0.05 : tier === "comfortable" ? 0.15 : 0.1;
  const resilienceRate = tier === "value" ? 0.05 : tier === "comfortable" ? 0.1 : 0.08;

  return {
    discretionary_rate: discretionaryRate,
    resilience_rate: resilienceRate,
    workable_net_salary: round(baseTotal + baseTotal * resilienceRate),
    comfortable_net_salary: round(baseTotal + baseTotal * resilienceRate + baseTotal * discretionaryRate),
  };
}

function affordabilityBand(
  netMonthlyIncome: number | null | undefined,
  workableNetSalary: number,
  comfortableNetSalary: number,
) {
  if (netMonthlyIncome === null || netMonthlyIncome === undefined) {
    return null;
  }
  if (netMonthlyIncome < workableNetSalary) {
    return "stretched" as const;
  }
  if (netMonthlyIncome < comfortableNetSalary) {
    return "workable" as const;
  }
  return "comfortable" as const;
}

export function calculateLocalQuote(request: QuoteRequest): QuoteResult {
  const suburb = localDataset.suburbs.find((item) => item.id === request.suburbId);

  if (!suburb) {
    throw new Error("No local suburb data is available for that request.");
  }

  const housing = resolveHousing(request);
  const transport = resolveTransport(request);
  const grocery = resolveCostBand("grocery", "base", request.lifestyleTier, {
    adults: request.adults,
    children: request.children ?? 0,
  });
  const utilities = resolveCostBand("utilities", "base", request.lifestyleTier, {
    adults: request.adults,
    children: request.children ?? 0,
  });
  const fibre = resolveCostBand("fibre", request.fibreTier ?? "none", request.lifestyleTier);
  const school = resolveCostBand("school", request.schoolType ?? "none", request.lifestyleTier);
  const childcare = resolveCostBand("childcare", request.childcare ?? "none", request.lifestyleTier);
  const domesticHelp = resolveCostBand(
    "domestic_help",
    request.domesticHelp ?? "none",
    request.lifestyleTier,
  );
  const backupPower = resolveCostBand(
    "backup_power",
    request.backupPower ?? "none",
    request.lifestyleTier,
  );

  const children = request.children ?? 0;
  const schoolSelected = round(school.selectedValue * children);
  const childcareSelected = round(childcare.selectedValue * children);

  const lowTotal = round(
    housing.lowValue +
      transport.lowValue +
      grocery.lowValue +
      utilities.lowValue +
      fibre.lowValue +
      school.lowValue * children +
      childcare.lowValue * children +
      domesticHelp.lowValue +
      backupPower.lowValue,
  );
  const midTotal = round(
    housing.midValue +
      transport.midValue +
      grocery.midValue +
      utilities.midValue +
      fibre.midValue +
      school.midValue * children +
      childcare.midValue * children +
      domesticHelp.midValue +
      backupPower.midValue,
  );
  const highTotal = round(
    housing.highValue +
      transport.highValue +
      grocery.highValue +
      utilities.highValue +
      fibre.highValue +
      school.highValue * children +
      childcare.highValue * children +
      domesticHelp.highValue +
      backupPower.highValue,
  );

  const selectedTotal = round(
    housing.selectedValue +
      transport.selectedValue +
      grocery.selectedValue +
      utilities.selectedValue +
      fibre.selectedValue +
      schoolSelected +
      childcareSelected +
      domesticHelp.selectedValue +
      backupPower.selectedValue,
  );

  const salaryThresholds = calculateSalaryThresholds(selectedTotal, request.lifestyleTier);
  const affordability = affordabilityBand(
    request.netMonthlyIncome,
    salaryThresholds.workable_net_salary,
    salaryThresholds.comfortable_net_salary,
  );

  const overallConfidence = (
    [housing.confidence, transport.confidence, school.confidence] as ConfidenceLevel[]
  ).sort((left, right) => confidenceRank(left) - confidenceRank(right))[0];

  return {
    snapshot_id: localDataset.snapshot.id,
    snapshot_version: localDataset.snapshot.versionLabel,
    suburb: suburb.name,
    suburb_slug: suburb.slug,
    monthly_cost: {
      low: lowTotal,
      mid: midTotal,
      high: highTotal,
      selected: selectedTotal,
    },
    categories: {
      housing: housing.selectedValue,
      transport: transport.selectedValue,
      groceries: grocery.selectedValue,
      utilities: utilities.selectedValue,
      schooling_childcare: schoolSelected + childcareSelected,
      connectivity: fibre.selectedValue,
      domestic_help: domesticHelp.selectedValue,
      backup_power: backupPower.selectedValue,
    },
    salary_thresholds: salaryThresholds,
    affordability,
    confidence: {
      overall: overallConfidence,
      housing: housing.confidence,
      transport: transport.confidence,
      schooling_childcare: school.confidence,
    },
    assumptions: {
      adults: request.adults,
      children,
      lifestyle_tier: request.lifestyleTier,
      bedrooms: request.bedrooms,
      parking_spaces: request.parkingSpaces ?? 0,
      property_type: request.propertyType ?? "any",
      work_destination_area: request.workDestinationArea ?? "remote",
      commute_days_per_week: request.commuteDaysPerWeek ?? 0,
      school_type: request.schoolType ?? "none",
      childcare: request.childcare ?? "none",
      domestic_help: request.domesticHelp ?? "none",
      fibre_tier: request.fibreTier ?? "none",
      backup_power: request.backupPower ?? "none",
    },
    drivers: [
      `Housing is the largest modeled cost driver in ${suburb.name}.`,
      children > 0 && (request.schoolType ?? "none") !== "none"
        ? "School choice is a major swing factor for this household."
        : "Transport and housing are the main variables after rent.",
      (request.workDestinationArea ?? "remote") === "remote"
        ? "Remote work reduces commute pressure materially."
        : (request.commuteDaysPerWeek ?? 0) <= 2
          ? "A lighter commute schedule keeps transport relatively contained."
          : `Commuting toward ${(request.workDestinationArea ?? "remote").replaceAll("_", " ")} meaningfully shapes monthly transport costs.`,
    ],
  };
}
