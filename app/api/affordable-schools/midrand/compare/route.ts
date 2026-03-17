import { NextResponse } from "next/server";

import { buildCompareRows } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

function normalizeBody(body: Record<string, unknown>) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(body)) {
    if (key === "schools") {
      continue;
    }

    if (Array.isArray(value)) {
      normalized[key] = value.join(",");
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    normalized[key] = String(value);
  }

  return normalized;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown> & {
      schools?: string[];
    };
    const filters = parseFiltersFromSearchParams(normalizeBody(body));
    const rows = await buildCompareRows((body.schools ?? []).slice(0, 4), filters);

    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json(
      {
        error: "invalid_request",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 },
    );
  }
}

