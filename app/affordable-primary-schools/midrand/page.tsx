import type { Metadata } from "next";

import { LandingPage } from "@/components/affordable-schools/landing-page";

export const metadata: Metadata = {
  title: "Affordable primary schools in Midrand",
  description:
    "Browse the Midrand primary-school leaf page for affordability-first shortlisting built on simulated school data.",
  alternates: {
    canonical: "/affordable-primary-schools/midrand",
  },
};

export default function AffordablePrimarySchoolsMidrandPage() {
  return <LandingPage variant="primary" />;
}

