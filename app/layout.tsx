import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getSiteUrl } from "@/lib/site";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AffordableSchools",
    template: "%s | AffordableSchools",
  },
  description:
    "AffordableSchools helps Midrand families shortlist affordable primary schools with simulated budget, commute, and feature matching.",
  applicationName: "AffordableSchools",
  alternates: {
    canonical: "/affordable-schools/midrand",
  },
  openGraph: {
    type: "website",
    url: "/affordable-schools/midrand",
    siteName: "AffordableSchools",
    title: "AffordableSchools",
    description:
      "Parent-first school matching for Midrand families, powered by clearly labeled simulated demo data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AffordableSchools",
    description:
      "Find affordable primary schools in Midrand with budget, commute, and shortlist-first matching.",
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
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-sand text-ink">
      <body>
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,164,90,0.22),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(55,114,255,0.14),_transparent_22%),linear-gradient(180deg,_#fffdf7_0%,_#f5efe2_100%)]">
          <div className="sticky top-0 z-40 border-b border-ink/10 bg-white/85 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-[1.1rem] bg-ink text-sm font-black text-white shadow-[0_12px_30px_rgba(24,34,47,0.18)]">
                  AS
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-clay">
                    AffordableSchools
                  </p>
                  <p className="text-sm font-semibold text-ink">Midrand</p>
                </div>
              </div>
              <div className="rounded-full border border-ink/10 bg-sand px-3 py-1.5 text-[11px] font-semibold text-ink-soft">
                2026
              </div>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
