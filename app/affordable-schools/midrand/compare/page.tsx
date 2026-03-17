import type { Metadata } from "next";
import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Shortlist redirect",
  description: "Redirects compare links to the shortlist review page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AffordableSchoolsComparePage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(resolvedSearchParams)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) {
          params.append(key, item);
        }
      });
    } else if (value) {
      params.set(key, value);
    }
  }

  redirect(
    `/affordable-schools/midrand/shortlist${
      params.size > 0 ? `?${params.toString()}` : ""
    }`,
  );
}
