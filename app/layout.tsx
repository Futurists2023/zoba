import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "zoba",
  description:
    "zoba is a mobile-first cost of living planner for young professionals, couples, and families.",
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
