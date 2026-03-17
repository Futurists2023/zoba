import type { Metadata } from "next";

import { LandingPage } from "@/components/affordable-schools/landing-page";

export const metadata: Metadata = {
  title: "Affordable schools in Midrand",
  description:
    "AffordableSchools helps Midrand families shortlist affordable schools using simulated budget, commute, and feature matching.",
  alternates: {
    canonical: "/affordable-schools/midrand",
  },
};

export default function AffordableSchoolsMidrandPage() {
  return <LandingPage variant="hub" />;
}

