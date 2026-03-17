import { matchSchools } from "@/lib/affordable-schools/engine";
import { getDefaultFilters } from "@/lib/affordable-schools/engine";

async function main() {
  const payload = await matchSchools(getDefaultFilters());
  console.log(JSON.stringify(payload.matches.slice(0, 3), null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

