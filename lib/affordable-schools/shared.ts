import { midrandSuburbs } from "@/lib/affordable-schools/catalog";
import type { MatchFilters, SchoolType } from "@/lib/affordable-schools/types";

const moneyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

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
