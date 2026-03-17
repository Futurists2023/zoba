"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FilterPanel } from "@/components/affordable-schools/filter-panel";
import { ResultsList } from "@/components/affordable-schools/results-list";
import { getDefaultFilters } from "@/lib/affordable-schools/shared";
import type { MatchFilters, MatchResult } from "@/lib/affordable-schools/types";

type LiveDiscoveryProps = {
  variant: "hub" | "primary";
  initialFilters?: MatchFilters;
  initialResults: MatchResult[];
  initialSource: string;
};

export function LiveDiscovery({
  variant,
  initialFilters = getDefaultFilters(),
  initialResults,
  initialSource,
}: LiveDiscoveryProps) {
  const [filters, setFilters] = useState<MatchFilters>(initialFilters);
  const [results, setResults] = useState<MatchResult[]>(initialResults);
  const [source, setSource] = useState(initialSource);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const isHub = variant === "hub";

  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    const controller = new AbortController();

    debounceRef.current = window.setTimeout(async () => {
      setIsRefreshing(true);
      setErrorMessage(null);

      try {
        const response = await fetch("/api/affordable-schools/midrand/match", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(filters),
          signal: controller.signal,
        });

        const payload = (await response.json()) as
          | { matches: MatchResult[]; source: string }
          | { error: string; message?: string };

        if (!response.ok || !("matches" in payload)) {
          setErrorMessage(
            "message" in payload
              ? (payload.message ?? "We could not refresh your matches.")
              : "We could not refresh your matches.",
          );
          return;
        }

        setResults(payload.matches);
        setSource(payload.source);
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setErrorMessage("We could not refresh your school list just now.");
      } finally {
        setIsRefreshing(false);
      }
    }, 180);

    return () => {
      controller.abort();
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [filters]);

  function update<K extends keyof MatchFilters>(
    key: K,
    value: MatchFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      ...(key === "budgetValue" ? { budgetType: "monthly" as const } : {}),
      [key]: value,
    }));
  }

  const shortlistInsights = useMemo(() => {
    const visibleResults = results.slice(0, 6);

    if (visibleResults.length === 0) {
      return {
        summary:
          "Widen the commute or relax one must-have to uncover more realistic Midrand options.",
        chips: ["Wider commute", "More schools", "Try fewer must-haves"],
        stats: [
          { label: "Aftercare", value: "0 ready" },
          { label: "Transport", value: "0 ready" },
          { label: "Activities", value: "0 strong" },
        ],
      };
    }

    const aftercareCount = visibleResults.filter(
      (result) => result.school.aftercareAvailable,
    ).length;
    const transportCount = visibleResults.filter(
      (result) => result.school.transportAvailable,
    ).length;
    const smallerClassCount = visibleResults.filter(
      (result) => result.school.classSizeEstimate <= 24,
    ).length;
    const activityRichCount = visibleResults.filter(
      (result) =>
        result.school.sports.length >= 3 ||
        result.school.swimmingAvailable ||
        result.school.mustHaveFeatures.includes("Music") ||
        result.school.mustHaveFeatures.includes("Coding/Robotics") ||
        result.school.niceToHaveFeatures.includes("Extra murals"),
    ).length;

    const insightCandidates = [
      aftercareCount >= 3 ? "Aftercare support" : null,
      transportCount >= 3 ? "Transport options" : null,
      activityRichCount >= 3 ? "Sport and extra murals" : null,
      smallerClassCount >= 3 ? "Smaller classes" : null,
      visibleResults.some((result) => result.school.swimmingAvailable)
        ? "Swimming access"
        : null,
    ].filter(Boolean) as string[];

    const chips = insightCandidates.slice(0, 4);
    const summaryLead =
      chips.length > 0 ? chips.join(", ") : "daily routine fit";
    const shorterRunCount = visibleResults.filter(
      (result) => result.distanceKm <= 4,
    ).length;
    return {
      summary: `These schools currently rise for ${summaryLead.toLowerCase()}${
        shorterRunCount >= 3 ? ", with several easier school-run options" : ""
      }.`,
      chips:
        chips.length > 0 ? chips : ["Daily routine fit", "School-life signals"],
      stats: [
        {
          label: "Aftercare",
          value: `${aftercareCount}/${visibleResults.length}`,
        },
        {
          label: "Transport",
          value: `${transportCount}/${visibleResults.length}`,
        },
        {
          label: "Activities",
          value: `${activityRichCount}/${visibleResults.length}`,
        },
      ],
    };
  }, [results]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <section className="rounded-[2.25rem] border border-ink/10 bg-white/88 p-6 shadow-[0_22px_70px_rgba(24,34,47,0.08)] backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
          AffordableSchools
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black tracking-tight text-ink md:text-5xl">
          {isHub
            ? "Welcome. Find Midrand schools that suit your family."
            : "Welcome. Find affordable primary schools in Midrand more easily."}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          Real-time school matching for parents who want faster decisions on
          monthly cost, commute, care options, and school-life fit.
        </p>
      </section>

      <section className="mt-5 rounded-[1.8rem] border border-ink/10 bg-sand/70 px-5 py-5 shadow-[0_16px_45px_rgba(24,34,47,0.05)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">
          Midrand school guide
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-ink-soft md:text-[15px]">
          {isHub
            ? "Explore affordable schools in Midrand with a live shortlist built for parents. Filter by monthly budget, grade, distance from your location, and the school qualities that matter most, then see school cards update instantly."
            : "Explore affordable primary schools in Midrand with a live shortlist built for families from Grade R to Grade 7. Filter by monthly budget, distance from your location, and practical school qualities, then review matching schools in real time."}
        </p>
      </section>

      <section className="mt-5 rounded-[1.8rem] border border-ink/10 bg-white/90 px-5 py-5 shadow-[0_18px_50px_rgba(24,34,47,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-ink/10 bg-sand px-3.5 py-1.5 text-sm font-semibold text-ink">
              {isRefreshing
                ? "Refreshing..."
                : `${results.length} schools found`}
            </div>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-ink-soft">
            Live filters
          </p>
        </div>

        <div className="mt-5">
          <FilterPanel
            filters={filters}
            onUpdate={update}
            onLocationLabelChange={setLocationLabel}
          />
        </div>
      </section>

      <section className="mt-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-clay">
              School cards
            </p>
            <h2 className="mt-2 text-xl font-black tracking-tight text-ink md:text-2xl">
              Schools matching right now
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-ink-soft">
              {shortlistInsights.summary} Showing live results{" "}
              {locationLabel ? `near ${locationLabel}` : "across Midrand"} for{" "}
              {filters.childGrade.toLowerCase()}.
            </p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-soft">
            Source: {source}
          </p>
        </div>

        {errorMessage ? (
          <div className="mt-4 rounded-[1.4rem] border border-clay/20 bg-white px-4 py-3 text-sm text-ink shadow-[0_18px_55px_rgba(24,34,47,0.06)]">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-5">
          <ResultsList filters={filters} results={results} />
        </div>
      </section>
    </main>
  );
}
