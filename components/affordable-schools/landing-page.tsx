import { LiveDiscovery } from "@/components/affordable-schools/live-discovery";
import { matchSchools } from "@/lib/affordable-schools/engine";
import { getDefaultFilters } from "@/lib/affordable-schools/shared";

type LandingPageProps = {
  variant: "hub" | "primary";
};

export async function LandingPage({ variant }: LandingPageProps) {
  const filters = getDefaultFilters();
  const payload = await matchSchools(filters);

  return (
    <LiveDiscovery
      variant={variant}
      initialFilters={filters}
      initialResults={payload.matches}
      initialSource={payload.source}
    />
  );
}
