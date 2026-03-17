import { CHILD_GRADES, FEATURES, MAX_COMMUTE_OPTIONS, SCHOOL_TYPE_PREFERENCES, type Feature, type MatchFilters } from "@/lib/affordable-schools/types";
import { getDefaultFilters } from "@/lib/affordable-schools/shared";

function asFeatureList(value: string | undefined): Feature[] {
  if (!value) {
    return [];
  }

  const allowed = new Set<string>(FEATURES);

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is Feature => allowed.has(item));
}

export function parseFiltersFromSearchParams(searchParams: URLSearchParams | Record<string, string | string[] | undefined>) {
  const defaults = getDefaultFilters();
  const getValue = (key: string) => {
    if (searchParams instanceof URLSearchParams) {
      return searchParams.get(key) ?? undefined;
    }

    const raw = searchParams[key];
    if (Array.isArray(raw)) {
      return raw[0];
    }

    return raw;
  };

  const childGrade = getValue("child_grade");
  const budgetType = getValue("budget_type");
  const budgetValue = Number(getValue("budget_value") ?? defaults.budgetValue);
  const homeSuburb = getValue("home_suburb");
  const workSuburb = getValue("work_suburb");
  const maxCommute = getValue("max_commute");
  const schoolType = getValue("school_type");

  return {
    childGrade: CHILD_GRADES.find((item) => item === childGrade) ?? defaults.childGrade,
    budgetType: budgetType === "annual" ? "annual" : defaults.budgetType,
    budgetValue: Number.isFinite(budgetValue) && budgetValue > 0 ? budgetValue : defaults.budgetValue,
    homeSuburb: homeSuburb && homeSuburb.length > 0 ? homeSuburb : defaults.homeSuburb,
    workSuburb: workSuburb && workSuburb.length > 0 ? workSuburb : "",
    maxCommute: MAX_COMMUTE_OPTIONS.find((item) => item === maxCommute) ?? defaults.maxCommute,
    mustHaveFeatures: asFeatureList(getValue("must_have_features")),
    niceToHaveFeatures: asFeatureList(getValue("nice_to_have_features")),
    schoolType: SCHOOL_TYPE_PREFERENCES.find((item) => item === schoolType) ?? defaults.schoolType,
  } satisfies MatchFilters;
}

export function serializeFilters(filters: MatchFilters) {
  const params = new URLSearchParams();
  params.set("child_grade", filters.childGrade);
  params.set("budget_type", filters.budgetType);
  params.set("budget_value", String(filters.budgetValue));
  params.set("home_suburb", filters.homeSuburb);

  if (filters.workSuburb) {
    params.set("work_suburb", filters.workSuburb);
  }

  params.set("max_commute", filters.maxCommute);
  params.set("school_type", filters.schoolType);

  if (filters.mustHaveFeatures.length > 0) {
    params.set("must_have_features", filters.mustHaveFeatures.join(","));
  }

  if (filters.niceToHaveFeatures.length > 0) {
    params.set("nice_to_have_features", filters.niceToHaveFeatures.join(","));
  }

  return params.toString();
}

