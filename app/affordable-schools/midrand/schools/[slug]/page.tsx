import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { formatCurrency, getSchoolDetail, getSchoolTypeLabel, getSuburbName } from "@/lib/affordable-schools/engine";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getSchoolDetail(slug);

  if (!detail) {
    return {
      title: "School not found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${detail.school.name} fees and reviews`,
    description: `Simulated detail page for ${detail.school.name} in Midrand.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function AffordableSchoolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const detail = await getSchoolDetail(slug);

  if (!detail) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <section className="rounded-[2.2rem] border border-ink/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(24,34,47,0.1)] backdrop-blur md:p-8">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">Non-indexed detail page</span>
          <span className="rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky">Demo data</span>
          <span className="rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-clay">{getSchoolTypeLabel(detail.school.schoolType)}</span>
        </div>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-ink md:text-5xl">{detail.school.name}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-ink-soft md:text-base">
          {getSuburbName(detail.school.suburbSlug)}, Midrand. This profile uses simulated fees, ratings, tradeoffs, and review content for design and testing only.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Annual fee</p><p className="mt-2 font-bold text-ink">{formatCurrency(detail.school.annualFeeMin)} - {formatCurrency(detail.school.annualFeeMax)}</p></div>
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Monthly estimate</p><p className="mt-2 font-bold text-ink">{formatCurrency(detail.school.monthlyEstimate)}</p></div>
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Registration fee</p><p className="mt-2 font-bold text-ink">{formatCurrency(detail.school.registrationFee)}</p></div>
          <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-4"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Simulated rating</p><p className="mt-2 font-bold text-ink">{detail.school.reviewScore.toFixed(1)} / 5</p></div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-5">
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Why this may suit your family</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink-soft">
              <li>Strongest fit areas: {detail.school.mustHaveFeatures.slice(0, 3).join(", ")}.</li>
              <li>Structured for Grade R to Grade 7 families in Midrand.</li>
              <li>Simulated review count: {detail.school.reviewCount} parent entries.</li>
            </ul>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Quick facts</p>
            <dl className="mt-4 grid gap-3 text-sm text-ink-soft">
              <div><dt className="font-semibold text-ink">Curriculum</dt><dd>{detail.school.curriculum}</dd></div>
              <div><dt className="font-semibold text-ink">Class size estimate</dt><dd>{detail.school.classSizeEstimate} learners</dd></div>
              <div><dt className="font-semibold text-ink">Aftercare</dt><dd>{detail.school.aftercareAvailable ? "Available" : "Not listed in this demo"}</dd></div>
              <div><dt className="font-semibold text-ink">Transport</dt><dd>{detail.school.transportAvailable ? "Available" : "Not listed in this demo"}</dd></div>
              <div><dt className="font-semibold text-ink">Swimming</dt><dd>{detail.school.swimmingAvailable ? "Available" : "No pool listed"}</dd></div>
            </dl>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Facilities and activities</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...detail.school.facilities, ...detail.school.sports].map((item) => (
                <span key={item} className="rounded-full border border-ink/10 bg-sand px-3 py-1 text-sm text-ink-soft">{item}</span>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-5">
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Admissions checklist</p>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink-soft">
              <li>Confirm the real fee structure directly with the school.</li>
              <li>Ask whether aftercare and transport still have space.</li>
              <li>Verify grade-entry availability and timeline.</li>
              <li>Use this demo page only as a planning prototype.</li>
            </ul>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Simulated reviews</p>
            <div className="mt-4 grid gap-4">
              {detail.reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-ink/10 bg-sand px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-ink">{review.headline}</h2>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-soft">{review.reviewerAlias} • {review.gradeRelevantToReview}</p>
                    </div>
                    <span className="rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{review.overallScore.toFixed(1)} / 5</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-ink-soft">{review.body}</p>
                </article>
              ))}
            </div>
          </article>
          <article className="rounded-[1.8rem] border border-ink/10 bg-white/85 p-5 shadow-[0_18px_55px_rgba(24,34,47,0.08)]">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Similar schools nearby</p>
              <Link className="rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink" href="/affordable-schools/midrand">Back to Midrand hub</Link>
            </div>
            <div className="mt-4 grid gap-3">
              {detail.similarSchools.map((school) => (
                <Link key={school.slug} href={`/affordable-schools/midrand/schools/${school.slug}`} className="rounded-2xl border border-ink/10 bg-sand px-4 py-4 transition hover:border-clay/40">
                  <h2 className="font-bold text-ink">{school.name}</h2>
                  <p className="mt-1 text-sm text-ink-soft">{getSuburbName(school.suburbSlug)} • {formatCurrency(school.annualFeeMin)} - {formatCurrency(school.annualFeeMax)}</p>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

