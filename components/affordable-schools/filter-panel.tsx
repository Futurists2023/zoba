"use client";

import { useState } from "react";

import { getMidrandSuburbs } from "@/lib/affordable-schools/shared";
import {
  CHILD_GRADES,
  SCHOOL_TYPE_PREFERENCES,
  type Feature,
  type MatchFilters,
} from "@/lib/affordable-schools/types";

type FilterPanelProps = {
  filters: MatchFilters;
  onUpdate: <K extends keyof MatchFilters>(
    key: K,
    value: MatchFilters[K],
  ) => void;
  onLocationLabelChange?: (label: string | null) => void;
};

const budgetMin = 3500;
const budgetMax = 14000;
const budgetStep = 500;
const randFormatter = new Intl.NumberFormat("en-US");

const commuteLabels: Record<MatchFilters["maxCommute"], string> = {
  under_3_km: "Under 3 km",
  under_5_km: "Under 5 km",
  under_8_km: "Under 8 km",
  under_12_km: "Under 12 km",
  best_within_20_min: "Best within 20 min",
};

const commuteOptions: MatchFilters["maxCommute"][] = [
  "under_3_km",
  "under_5_km",
  "under_8_km",
  "under_12_km",
  "best_within_20_min",
];

const schoolTypeLabels: Record<MatchFilters["schoolType"], string> = {
  private_only: "Private only",
  public_only: "Public only",
  both: "Both",
};

const mustHaveFeatures = [
  "Aftercare",
  "Transport",
  "Small classes",
  "Swimming",
  "Music",
  "Coding/Robotics",
  "Library",
  "Religious alignment",
] as const satisfies readonly Feature[];

const niceToHaveFeatures = [
  "Extra murals",
  "Modern classrooms",
  "Meal option",
  "Holiday care",
  "Sibling discount",
] as const satisfies readonly Feature[];

function toggleFeature(list: Feature[], feature: Feature) {
  return list.includes(feature)
    ? list.filter((item) => item !== feature)
    : [...list, feature];
}

function formatRand(value: number) {
  return `R${randFormatter.format(value)}`;
}

function getRangeProgress(value: number, min: number, max: number) {
  if (max === min) {
    return "0%";
  }

  return `${((value - min) / (max - min)) * 100}%`;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKm(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number,
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLatitude - fromLatitude);
  const dLon = toRadians(toLongitude - fromLongitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLatitude)) *
      Math.cos(toRadians(toLatitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNearestSuburb(
  latitude: number,
  longitude: number,
  suburbs: ReturnType<typeof getMidrandSuburbs>,
) {
  return suburbs.reduce(
    (closest, suburb) => {
      const suburbDistance = getDistanceKm(
        latitude,
        longitude,
        suburb.latitude,
        suburb.longitude,
      );

      if (!closest || suburbDistance < closest.distanceKm) {
        return {
          slug: suburb.slug,
          name: suburb.name,
          distanceKm: suburbDistance,
        };
      }

      return closest;
    },
    null as { slug: string; name: string; distanceKm: number } | null,
  );
}

type ChipButtonProps = {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function ChipButton({ active, children, onClick }: ChipButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3.5 py-2 text-sm transition ${
        active
          ? "border-ink bg-ink text-white"
          : "border-ink/10 bg-white text-ink-soft hover:border-clay/40 hover:text-ink"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function FilterPanel({
  filters,
  onUpdate,
  onLocationLabelChange,
}: FilterPanelProps) {
  const suburbs = getMidrandSuburbs();
  const gradeIndex = CHILD_GRADES.indexOf(filters.childGrade);
  const commuteIndex = commuteOptions.indexOf(filters.maxCommute);
  const [locationState, setLocationState] = useState<
    "idle" | "requesting" | "success" | "error"
  >("idle");
  const [locationMessage, setLocationMessage] = useState<string>(
    "Allow location to estimate commute from where you are now.",
  );

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setLocationState("error");
      setLocationMessage("Location services are not available on this device.");
      onLocationLabelChange?.(null);
      return;
    }

    setLocationState("requesting");
    setLocationMessage("Requesting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nearestSuburb = getNearestSuburb(
          position.coords.latitude,
          position.coords.longitude,
          suburbs,
        );

        if (!nearestSuburb) {
          setLocationState("error");
          setLocationMessage(
            "We could not match your location to a Midrand suburb.",
          );
          onLocationLabelChange?.(null);
          return;
        }

        onUpdate("homeSuburb", nearestSuburb.slug);
        onLocationLabelChange?.(nearestSuburb.name);
        setLocationState("success");
        setLocationMessage(
          `Location on. Using ${nearestSuburb.name} for a more realistic school run.`,
        );
      },
      () => {
        setLocationState("error");
        setLocationMessage(
          "Location access was declined. We will keep showing wider Midrand matches.",
        );
        onLocationLabelChange?.(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  }

  return (
    <div className="grid gap-5">
      <div>
        <p className="text-sm font-semibold text-ink">Monthly budget</p>
        <div className="mt-3 rounded-[1.4rem] border border-ink/10 bg-sand px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-black text-ink">
              {formatRand(filters.budgetValue)}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
              per month
            </p>
          </div>
          <input
            className="app-range mt-4 h-2 w-full cursor-pointer rounded-full"
            type="range"
            min={budgetMin}
            max={budgetMax}
            step={budgetStep}
            value={filters.budgetValue}
            style={{
              ["--range-progress" as string]: getRangeProgress(
                filters.budgetValue,
                budgetMin,
                budgetMax,
              ),
            }}
            onChange={(event) => {
              onUpdate("budgetType", "monthly");
              onUpdate("budgetValue", Number(event.target.value));
            }}
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
            <span>{formatRand(budgetMin)}</span>
            <span>{formatRand(budgetMax)}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Child grade</p>
        <div className="mt-3 rounded-[1.4rem] border border-ink/10 bg-sand px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg font-black text-ink">{filters.childGrade}</p>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
              Grade range
            </p>
          </div>
          <input
            className="app-range mt-4 h-2 w-full cursor-pointer rounded-full"
            type="range"
            min={0}
            max={CHILD_GRADES.length - 1}
            step={1}
            value={gradeIndex}
            style={{
              ["--range-progress" as string]: getRangeProgress(
                gradeIndex,
                0,
                CHILD_GRADES.length - 1,
              ),
            }}
            onChange={(event) =>
              onUpdate("childGrade", CHILD_GRADES[Number(event.target.value)])
            }
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
            <span>{CHILD_GRADES[0]}</span>
            <span>{CHILD_GRADES[CHILD_GRADES.length - 1]}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Commute</p>
        <div className="mt-3 rounded-[1.5rem] border border-ink/10 bg-sand px-4 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">
                Make commute estimates more realistic
              </p>
              <p className="mt-1 text-xs leading-5 text-ink-soft">
                Turn on location so we can use your current area for a more
                realistic school run.
              </p>
            </div>
            <button
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                locationState === "success"
                  ? "bg-leaf text-white"
                  : "bg-ink text-white hover:bg-ink/90"
              }`}
              onClick={useCurrentLocation}
            >
              {locationState === "requesting"
                ? "Checking location..."
                : locationState === "success"
                  ? "Location active"
                  : "Use my location"}
            </button>
          </div>
          <p
            className={`mt-3 text-xs leading-5 ${
              locationState === "error"
                ? "text-clay"
                : locationState === "success"
                  ? "text-leaf"
                  : "text-ink-soft"
            }`}
          >
            {locationMessage}
          </p>
          {locationState === "success" ? (
            <div className="mt-4 rounded-[1.25rem] border border-ink/10 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink">
                  Preferred school-run distance
                </p>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">
                  {commuteLabels[filters.maxCommute]}
                </p>
              </div>
              <input
                className="app-range mt-4 h-2 w-full cursor-pointer rounded-full"
                type="range"
                min={0}
                max={commuteOptions.length - 1}
                step={1}
                value={commuteIndex >= 0 ? commuteIndex : 2}
                style={{
                  ["--range-progress" as string]: getRangeProgress(
                    commuteIndex >= 0 ? commuteIndex : 2,
                    0,
                    commuteOptions.length - 1,
                  ),
                }}
                onChange={(event) =>
                  onUpdate(
                    "maxCommute",
                    commuteOptions[Number(event.target.value)],
                  )
                }
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
                <span>{commuteLabels[commuteOptions[0]]}</span>
                <span>
                  {commuteLabels[commuteOptions[commuteOptions.length - 1]]}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">School type</p>
        <div className="relative mt-3 rounded-[1.4rem] border border-ink/10 bg-sand px-4 py-3">
          <select
            className="app-select w-full appearance-none bg-transparent pr-8 text-sm font-semibold text-ink outline-none"
            value={filters.schoolType}
            onChange={(event) =>
              onUpdate(
                "schoolType",
                event.target.value as MatchFilters["schoolType"],
              )
            }
          >
            {SCHOOL_TYPE_PREFERENCES.map((option) => (
              <option key={option} value={option}>
                {schoolTypeLabels[option]}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-soft">
            v
          </span>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-ink">Need this</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {mustHaveFeatures.map((feature) => (
            <ChipButton
              key={feature}
              active={filters.mustHaveFeatures.includes(feature)}
              onClick={() =>
                onUpdate(
                  "mustHaveFeatures",
                  toggleFeature(filters.mustHaveFeatures, feature),
                )
              }
            >
              {feature}
            </ChipButton>
          ))}
        </div>
      </div>
    </div>
  );
}
