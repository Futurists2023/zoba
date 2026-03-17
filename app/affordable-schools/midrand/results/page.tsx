import type { Metadata } from "next";

import { ResultsList } from "@/components/affordable-schools/results-list";
import { formatCurrency, matchSchools } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Live Midrand school results",
  description:
    "Live Midrand school results using sample data while verified coverage is being prepared.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AffordableSchoolsResultsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFiltersFromSearchParams(resolvedSearchParams);
  const payload = await matchSchools(filters);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[2rem] border border-ink/10 bg-white/75 p-6 shadow-[0_20px_70px_rgba(24,34,47,0.1)] backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">Non-indexed utility page</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
          Live Midrand matches for your current filters
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          This screen updates the same sample-data match model used on the main mobile discovery experience. Current annual budget target: {formatCurrency(payload.annualBudget)}.
        </p>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[1.8rem] border border-ink/10 bg-white/80 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)] h-fit">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Current setup</p>
          <dl className="mt-4 grid gap-4 text-sm text-ink-soft">
            <div>
              <dt className="font-semibold text-ink">Child grade</dt>
              <dd>{filters.childGrade}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Home suburb</dt>
              <dd>{filters.homeSuburb}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Commute</dt>
              <dd>{filters.maxCommute.replaceAll("_", " ")}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Must-haves</dt>
              <dd>{filters.mustHaveFeatures.join(", ") || "None selected"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Nice-to-haves</dt>
              <dd>{filters.niceToHaveFeatures.join(", ") || "None selected"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-ink">Source</dt>
              <dd>{payload.source}</dd>
            </div>
          </dl>
        </aside>

        <ResultsList filters={filters} results={payload.matches} />
      </section>
    </main>
  );
}

