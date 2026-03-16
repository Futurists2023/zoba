import { NextResponse } from "next/server";

import { calculateDatabaseQuote } from "@/lib/database-quote-engine";
import { calculateLocalQuote } from "@/lib/local-quote-engine";
import { normalizeQuoteRequest } from "@/lib/quote";

export async function POST(request: Request) {
  try {
    const payload = normalizeQuoteRequest(await request.json());
    const useDatabase = Boolean(process.env.SUPABASE_DB_URL);
    const data = useDatabase
      ? await calculateDatabaseQuote(payload)
      : calculateLocalQuote(payload);

    return NextResponse.json({
      data,
      source: useDatabase ? "supabase" : "local-dataset",
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
