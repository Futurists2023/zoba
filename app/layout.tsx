import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "zoba",
    template: "%s | zoba",
  },
  description:
    "zoba is a mobile-first cost of living planner for young professionals, couples, and families.",
  applicationName: "zoba",
  alternates: {
    canonical: "/cost-of-living/capetown",
  },
  openGraph: {
    type: "website",
    url: "/cost-of-living/capetown",
    siteName: "zoba",
    title: "zoba",
    description:
      "zoba is a mobile-first cost of living planner for young professionals, couples, and families.",
  },
  twitter: {
    card: "summary_large_image",
    title: "zoba",
    description:
      "zoba is a mobile-first cost of living planner for young professionals, couples, and families.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "Uwjqmg3-739dulHr8Vl_2HuS2abol3-Gs43Eaw6edH0",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
