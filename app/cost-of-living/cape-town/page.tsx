import type { Metadata } from "next";

import { QuoteExperience } from "@/components/quote-experience";

export const metadata: Metadata = {
  title: "Cost of Living in Cape Town, South Africa",
  description:
    "zoba helps you estimate the cost of living in Cape Town with a mobile-first planner for rent, commute, groceries, fibre, and backup power.",
  alternates: {
    canonical: "/cost-of-living/cape-town",
  },
  openGraph: {
    title: "Cost of Living in Cape Town, South Africa",
    description:
      "zoba helps you estimate the cost of living in Cape Town with a mobile-first planner for rent, commute, groceries, fibre, and backup power.",
    url: "/cost-of-living/cape-town",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cost of Living in Cape Town, South Africa",
    description:
      "zoba helps you estimate the cost of living in Cape Town with a mobile-first planner for rent, commute, groceries, fibre, and backup power.",
  },
};

export default function CapeTownCostOfLivingPage() {
  return <QuoteExperience />;
}
