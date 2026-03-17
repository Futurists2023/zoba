import type { Metadata } from "next";
import Link from "next/link";

import { buildCompareRows } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Your Midrand shortlist",
  description: "Review shortlisted Midrand school options using simulated demo data.",
  robots: {
    index: false,
    follow: false,
  },
};

function parseMonthlyValue(value: string) {
  return Number(value.replace(/[^\d.-]/g, ""));
}

function parseDistanceValue(value: string) {
  return Number(value.replace(/[^\d.-]/g, ""));
}

function getShortlistHighlights(rows: Awaited<ReturnType<typeof buildCompareRows>>) {
  if (rows.length === 0) {
    return [];
  }

  const lowestMonthly = rows.reduce((best, row) =>
    parseMonthlyValue(row.monthlyEstimate) < parseMonthlyValue(best.monthlyEstimate) ? row : best,
  );
  const easiestRun = rows.reduce((best, row) =>
    parseDistanceValue(row.distance) < parseDistanceValue(best.distance) ? row : best,
  );
  const strongestSupport =
    rows.find((row) => row.aftercare === "Yes" && row.transport === "Yes") ??
    rows.find((row) => row.aftercare === "Yes") ??
    rows[0];
  const mostRounded = rows[0];

  return [
    {
      label: "Easiest on monthly budget",
      school: lowestMonthly.name,
      note: `${lowestMonthly.monthlyEstimate} per month`,
    },
    {
      label: "Easiest school run",
      school: easiestRun.name,
      note: `${easiestRun.distance} from your location`,
    },
    {
      label: "Strongest weekday support",
      school: strongestSupport.name,
      note:
        strongestSupport.aftercare === "Yes" && strongestSupport.transport === "Yes"
          ? "Aftercare and transport available"
          : strongestSupport.aftercare === "Yes"
            ? "Aftercare available"
            : "Practical support option",
    },
    {
      label: "Most rounded family fit",
      school: mostRounded.name,
      note: `${mostRounded.bestFor} with ${mostRounded.tradeoff.toLowerCase()}`,
    },
  ];
}

export default async function AffordableSchoolsShortlistPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const filters = parseFiltersFromSearchParams(resolvedSearchParams);
  const schoolsValue = Array.isArray(resolvedSearchParams.schools)
    ? resolvedSearchParams.schools[0]
    : resolvedSearchParams.schools;
  const slugs = (schoolsValue ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
  const rows = await buildCompareRows(slugs, filters);
  const highlights = getShortlistHighlights(rows);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[2rem] border border-ink/10 bg-white/80 p-6 shadow-[0_20px_70px_rgba(24,34,47,0.1)] backdrop-blur md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-clay">
          Shortlist review
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-ink md:text-5xl">
          Schools worth keeping on your shortlist
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          Start with the strongest differences first, then use the full table if
          you want a deeper side-by-side check.
        </p>
      </section>

      {rows.length === 0 ? (
        <section className="mt-8 rounded-[1.8rem] border border-ink/10 bg-white/80 p-6 text-ink shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
          <p className="text-lg font-semibold">No schools shortlisted yet.</p>
          <Link
            className="mt-4 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
            href="/affordable-schools/midrand"
          >
            Back to discovery
          </Link>
        </section>
      ) : (
        <>
          <section className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {highlights.map((highlight) => (
              <article
                key={highlight.label}
                className="rounded-[1.6rem] border border-ink/10 bg-white/85 px-4 py-4 shadow-[0_18px_45px_rgba(24,34,47,0.06)]"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-clay">
                  {highlight.label}
                </p>
                <h2 className="mt-2 text-lg font-black tracking-tight text-ink">
                  {highlight.school}
                </h2>
                <p className="mt-2 text-sm leading-6 text-ink-soft">{highlight.note}</p>
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
                  Key differences
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">
                  See what separates your finalists
                </h2>
              </div>
              <p className="text-sm text-ink-soft">
                {rows.length} shortlisted school{rows.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="min-w-full border-collapse text-left text-sm">
                <thead className="bg-ink text-white">
                  <tr>
                    <th className="px-4 py-4 font-semibold">School</th>
                    <th className="px-4 py-4 font-semibold">Monthly estimate</th>
                    <th className="px-4 py-4 font-semibold">Distance</th>
                    <th className="px-4 py-4 font-semibold">Aftercare</th>
                    <th className="px-4 py-4 font-semibold">Transport</th>
                    <th className="px-4 py-4 font-semibold">Swimming</th>
                    <th className="px-4 py-4 font-semibold">Sports</th>
                    <th className="px-4 py-4 font-semibold">Rating</th>
                    <th className="px-4 py-4 font-semibold">Best for</th>
                    <th className="px-4 py-4 font-semibold">Tradeoff</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.slug} className={index % 2 === 0 ? "bg-white" : "bg-sand/50"}>
                      <td className="px-4 py-4 font-semibold text-ink">
                        {row.name}
                        <div className="mt-1 text-xs font-normal uppercase tracking-[0.16em] text-ink-soft">
                          {row.suburb} • {row.schoolType}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ink-soft">{row.monthlyEstimate}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.distance}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.aftercare}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.transport}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.swimming}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.sports}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.rating}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.bestFor}</td>
                      <td className="px-4 py-4 text-ink-soft">{row.tradeoff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
