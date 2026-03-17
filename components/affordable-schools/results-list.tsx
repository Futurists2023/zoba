"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  formatCurrency,
  getSchoolTypeLabel,
  getSuburbName,
} from "@/lib/affordable-schools/shared";
import { serializeFilters } from "@/lib/affordable-schools/query";
import type { MatchFilters, MatchResult } from "@/lib/affordable-schools/types";

type ResultsListProps = {
  filters: MatchFilters;
  results: MatchResult[];
};

function getClassroomLabel(classSizeEstimate: number) {
  if (classSizeEstimate <= 22) {
    return "Smaller classes";
  }

  if (classSizeEstimate <= 30) {
    return "Balanced class size";
  }

  return "Larger class groups";
}

function getActivityHighlights(result: MatchResult) {
  const highlightPool = [
    ...result.school.sports,
    ...(result.school.swimmingAvailable ? ["Swimming"] : []),
    ...result.school.mustHaveFeatures.filter((feature) =>
      ["Music", "Coding/Robotics", "Extra murals"].includes(feature),
    ),
    ...result.school.niceToHaveFeatures.filter((feature) =>
      ["Music", "Coding/Robotics", "Extra murals"].includes(feature),
    ),
  ];

  return highlightPool
    .filter((item, index, list) => list.indexOf(item) === index)
    .slice(0, 4);
}

function getParentFitSummary(result: MatchResult) {
  const support = result.school.aftercareAvailable ? "aftercare" : null;
  const transport = result.school.transportAvailable ? "transport" : null;
  const smallerClasses =
    result.school.classSizeEstimate <= 24 ? "smaller classes" : null;
  const activities = getActivityHighlights(result)[0]?.toLowerCase() ?? null;

  const fitReasons = [support, transport, smallerClasses, activities].filter(
    Boolean,
  ) as string[];

  if (fitReasons.length === 0) {
    return "A balanced option across routine, school basics, and day-to-day fit.";
  }

  return `May suit families who care about ${fitReasons.slice(0, 3).join(", ")}.`;
}

function getFeatureChips(result: MatchResult, activityHighlights: string[]) {
  const activitySet = new Set(activityHighlights);

  return [...result.school.mustHaveFeatures, ...result.school.facilities]
    .filter((feature, index, list) => list.indexOf(feature) === index)
    .filter((feature) => !activitySet.has(feature))
    .slice(0, 6);
}

export function ResultsList({ filters, results }: ResultsListProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const filtersQuery = useMemo(() => serializeFilters(filters), [filters]);

  function toggleSelection(slug: string) {
    setSelected((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length >= 4
          ? current
          : [...current, slug],
    );
  }

  function goToCompare() {
    const params = new URLSearchParams(filtersQuery);
    params.set("schools", selected.join(","));
    router.push(`/affordable-schools/midrand/shortlist?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 pb-24 md:pb-6">
      {results.map((result) => {
        const isSelected = selected.includes(result.school.slug);
        const activityHighlights = getActivityHighlights(result);
        const featureChips = getFeatureChips(result, activityHighlights);

        return (
          <article
            key={result.school.slug}
            className="rounded-[1.5rem] border border-ink/10 bg-white/92 p-4 shadow-[0_18px_50px_rgba(24,34,47,0.07)] backdrop-blur"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                    Fit score {result.fitScore}
                  </span>
                  <span className="rounded-full bg-clay/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-clay">
                    {getSchoolTypeLabel(result.school.schoolType)}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-black tracking-tight text-ink md:text-[1.35rem]">
                  {result.school.name}
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-ink-soft md:text-sm">
                  {getSuburbName(result.school.suburbSlug)} •{" "}
                  {result.tradeoffLabel} •{" "}
                  {result.topMatchingFeatures.join(", ") ||
                    "Balanced Midrand option"}
                </p>
              </div>

              <div className="rounded-[1.35rem] border border-ink/10 bg-sand px-3.5 py-3 text-sm text-ink lg:min-w-[210px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                  Monthly fee estimate
                </p>
                <p className="mt-1.5 text-xl font-black text-ink">
                  {formatCurrency(result.school.monthlyEstimate)}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-ink-soft">
                  <p>
                    <span className="font-semibold text-ink">
                      {result.distanceKm.toFixed(1)} km
                    </span>
                    <span className="block">from your area</span>
                  </p>
                  <p>
                    <span className="font-semibold text-ink">
                      {result.school.curriculum}
                    </span>
                    <span className="block">
                      {getClassroomLabel(result.school.classSizeEstimate)}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Aftercare:</span>{" "}
                    {result.school.aftercareAvailable
                      ? "Available"
                      : "Not listed"}
                  </p>
                  <p>
                    <span className="font-semibold text-ink">Transport:</span>{" "}
                    {result.school.transportAvailable ? "Listed" : "Not listed"}
                  </p>
                </div>
                <div className="mt-2.5 border-t border-ink/10 pt-2.5 text-xs text-ink-soft">
                  <p className="font-semibold text-ink">
                    {activityHighlights.slice(0, 2).join(", ") ||
                      "Core activities"}
                  </p>
                  <p className="mt-1">
                    {activityHighlights.length > 2
                      ? `${activityHighlights[2]}${activityHighlights[3] ? `, ${activityHighlights[3]}` : ""}`
                      : result.school.swimmingAvailable
                        ? "Swimming listed"
                        : "Fewer extras listed"}
                  </p>
                </div>
                {featureChips.length > 0 ? (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-ink/10 pt-2.5">
                    {featureChips.map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-ink/10 bg-white px-2.5 py-1 text-[11px] text-ink-soft"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {result.missingMustHaves.length > 0 ? (
              <div className="mt-4 rounded-[1.2rem] border border-clay/20 bg-clay/10 px-3.5 py-3 text-sm text-ink">
                Tradeoff to note: missing {result.missingMustHaves.join(", ")}
              </div>
            ) : null}

            <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
              <Link
                className="rounded-full bg-ink px-4 py-2.5 text-center text-sm font-bold text-white transition hover:bg-ink/90"
                href={`/affordable-schools/midrand/schools/${result.school.slug}?${filtersQuery}`}
              >
                View school
              </Link>
              <button
                type="button"
                className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  isSelected
                    ? "border-sky bg-sky text-white"
                    : "border-ink/10 bg-white text-ink hover:border-sky/40"
                }`}
                onClick={() => toggleSelection(result.school.slug)}
              >
                {isSelected ? "Shortlisted" : "Shortlist"}
              </button>
            </div>
          </article>
        );
      })}

      {selected.length > 0 ? (
        <div className="sticky bottom-24 z-20 flex flex-col gap-3 rounded-[1.4rem] border border-ink/10 bg-ink p-4 text-white shadow-[0_24px_70px_rgba(24,34,47,0.18)] md:bottom-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Shortlist
            </p>
            <p className="mt-1 text-sm text-white/80">
              {selected.length} school{selected.length === 1 ? "" : "s"} shortlisted.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold/90"
            onClick={goToCompare}
          >
            Review shortlist
          </button>
        </div>
      ) : null}
    </div>
  );
}
