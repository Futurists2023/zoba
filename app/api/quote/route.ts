import { NextResponse } from "next/server";

import { hasUsableSupabaseDbUrl } from "@/lib/db/server";
import { calculateDatabaseQuote } from "@/lib/database-quote-engine";
import { calculateLocalQuote } from "@/lib/local-quote-engine";
import { normalizeQuoteRequest } from "@/lib/quote";

export async function POST(request: Request) {
  try {
    const payload = normalizeQuoteRequest(await request.json());
    const useDatabase = hasUsableSupabaseDbUrl();

    if (useDatabase) {
      try {
        const data = await calculateDatabaseQuote(payload);

        return NextResponse.json({
          data,
          source: "supabase",
        });
      } catch (error) {
        console.error("Database quote failed, falling back to local dataset.", error);
      }
    }

    const data = calculateLocalQuote(payload);

    return NextResponse.json({
      data,
      source: useDatabase ? "local-fallback" : "local-dataset",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      {
        error: "invalid_request",
        message,
      },
      { status: 400 },
    );
  }
}
