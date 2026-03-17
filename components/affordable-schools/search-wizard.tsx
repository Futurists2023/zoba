"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

import { getDefaultFilters, getMidrandSuburbs } from "@/lib/affordable-schools/shared";
import { serializeFilters } from "@/lib/affordable-schools/query";
import {
  CHILD_GRADES,
  FEATURES,
  MAX_COMMUTE_OPTIONS,
  SCHOOL_TYPE_PREFERENCES,
  type Feature,
  type MatchFilters,
} from "@/lib/affordable-schools/types";

type SearchWizardProps = {
  ctaLabel?: string;
  tone?: "hub" | "leaf";
};

const commuteLabels: Record<MatchFilters["maxCommute"], string> = {
  under_3_km: "Under 3 km",
  under_5_km: "Under 5 km",
  under_8_km: "Under 8 km",
  under_12_km: "Under 12 km",
  best_within_20_min: "Best options within 20 min",
};

const schoolTypeLabels: Record<MatchFilters["schoolType"], string> = {
  private_only: "Private only",
  public_only: "Public only",
  both: "Both",
};

function featureToggle(list: Feature[], feature: Feature) {
  return list.includes(feature)
    ? list.filter((item) => item !== feature)
    : [...list, feature];
}

export function SearchWizard({
  ctaLabel = "Find schools that fit your budget",
  tone = "hub",
}: SearchWizardProps) {
  const router = useRouter();
  const suburbs = getMidrandSuburbs();
  const defaults = getDefaultFilters();
  const [filters, setFilters] = useState<MatchFilters>(defaults);
  const [isPending, setIsPending] = useState(false);

  function update<K extends keyof MatchFilters>(key: K, value: MatchFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function submitWizard() {
    setIsPending(true);
    startTransition(() => {
      const query = serializeFilters(filters);
      router.push(`/affordable-schools/midrand/results?${query}`);
    });
  }

  return (
    <section className="rounded-[2rem] border border-ink/10 bg-white/80 p-5 shadow-[0_24px_80px_rgba(24,34,47,0.12)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
            Parent Match Wizard
          </p>
          <h2 className="mt-2 max-w-2xl text-3xl font-black tracking-tight text-ink md:text-4xl">
            Start with your family constraints before you browse schools.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft md:text-base">
            This prototype ranks Midrand schools using simulated fees, distances,
            features, and reviews. Use it to test flows, not to make real school decisions.
          </p>
        </div>
        <div className="rounded-full border border-clay/20 bg-clay/10 px-4 py-2 text-sm font-semibold text-clay">
          {tone === "hub" ? "Broad Midrand hub" : "Primary-school leaf intent"}
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-ink">
              What grade is your child entering?
            </span>
            <select
              className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none ring-0"
              value={filters.childGrade}
              onChange={(event) => update("childGrade", event.target.value as MatchFilters["childGrade"])}
            >
              {CHILD_GRADES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-[180px_1fr]">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Budget type</span>
              <select
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                value={filters.budgetType}
                onChange={(event) => update("budgetType", event.target.value as MatchFilters["budgetType"])}
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">School fee budget</span>
              <input
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                type="number"
                min={1000}
                max={250000}
                step={500}
                value={filters.budgetValue}
                onChange={(event) => update("budgetValue", Number(event.target.value))}
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Where do you live?</span>
              <select
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                value={filters.homeSuburb}
                onChange={(event) => update("homeSuburb", event.target.value)}
              >
                {suburbs.map((suburb) => (
                  <option key={suburb.slug} value={suburb.slug}>
                    {suburb.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-ink">Where do you work? Optional</span>
              <select
                className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-ink outline-none"
                value={filters.workSuburb ?? ""}
                onChange={(event) => update("workSuburb", event.target.value)}
              >
                <option value="">Skip this for now</option>
                {suburbs.map((suburb) => (
                  <option key={suburb.slug} value={suburb.slug}>
                    {suburb.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">How far are you willing to travel?</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {MAX_COMMUTE_OPTIONS.map((option) => {
                const active = filters.maxCommute === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-sky bg-sky/10 text-ink"
                        : "border-ink/10 bg-white text-ink-soft hover:border-clay/30 hover:bg-clay/5"
                    }`}
                    onClick={() => update("maxCommute", option)}
                  >
                    <span className="font-semibold">{commuteLabels[option]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <p className="text-sm font-semibold text-ink">What must the school have?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURES.slice(0, 11).map((feature) => {
                const active = filters.mustHaveFeatures.includes(feature);

                return (
                  <button
                    key={feature}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-ink bg-ink text-white"
                        : "border-ink/10 bg-white text-ink-soft hover:border-clay/40 hover:text-ink"
                    }`}
                    onClick={() => update("mustHaveFeatures", featureToggle(filters.mustHaveFeatures, feature))}
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">Anything nice to have?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEATURES.slice(11).map((feature) => {
                const active = filters.niceToHaveFeatures.includes(feature);

                return (
                  <button
                    key={feature}
                    type="button"
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-clay bg-clay text-white"
                        : "border-ink/10 bg-white text-ink-soft hover:border-clay/40 hover:text-ink"
                    }`}
                    onClick={() =>
                      update("niceToHaveFeatures", featureToggle(filters.niceToHaveFeatures, feature))
                    }
                  >
                    {feature}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">What type of school are you open to?</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {SCHOOL_TYPE_PREFERENCES.map((option) => {
                const active = filters.schoolType === option;

                return (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      active
                        ? "border-leaf bg-leaf text-white"
                        : "border-ink/10 bg-white text-ink-soft hover:border-leaf/40 hover:text-ink"
                    }`}
                    onClick={() => update("schoolType", option)}
                  >
                    <span className="font-semibold">{schoolTypeLabels[option]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-ink/10 bg-ink px-5 py-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
              Demo rules
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/80">
              <li>Only Midrand-focused primary results are included in Phase 1.</li>
              <li>All fees, reviews, scores, and distances are simulated.</li>
              <li>Compare up to 4 schools side by side.</li>
            </ul>
            <button
              type="button"
              className="mt-5 w-full rounded-full bg-gold px-5 py-3 text-sm font-bold text-ink transition hover:bg-gold/90 disabled:cursor-progress disabled:opacity-70"
              onClick={submitWizard}
              disabled={isPending}
            >
              {isPending ? "Building your shortlist..." : ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


