import { NextResponse } from "next/server";

import { matchSchools } from "@/lib/affordable-schools/engine";
import { parseFiltersFromSearchParams } from "@/lib/affordable-schools/query";

function normalizeBody(body: Record<string, unknown>) {
  const normalized: Record<string, string> = {};

  for (const [key, value] of Object.entries(body)) {
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
    const body = (await request.json()) as Record<string, unknown>;
    const filters = parseFiltersFromSearchParams(normalizeBody(body));
    const payload = await matchSchools(filters);

    return NextResponse.json(payload);
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

