import { NextResponse } from "next/server";

import { createClaudeCompletion, getClaudeModel } from "@/lib/claude";

export const runtime = "nodejs";

type ClaudeRequestBody = {
  prompt?: unknown;
  system?: unknown;
  maxTokens?: unknown;
  temperature?: unknown;
  model?: unknown;
};

type ParsedClaudeRequestBody = {
  prompt: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
};

function parseBody(body: ClaudeRequestBody): ParsedClaudeRequestBody {
  if (typeof body.prompt !== "string" || body.prompt.trim().length === 0) {
    throw new Error("The request body must include a non-empty prompt string.");
  }

  if (body.maxTokens !== undefined && (!Number.isInteger(body.maxTokens) || Number(body.maxTokens) <= 0)) {
    throw new Error("maxTokens must be a positive integer.");
  }

  if (
    body.temperature !== undefined &&
    (typeof body.temperature !== "number" || Number.isNaN(body.temperature) || body.temperature < 0 || body.temperature > 1)
  ) {
    throw new Error("temperature must be a number between 0 and 1.");
  }

  if (body.system !== undefined && typeof body.system !== "string") {
    throw new Error("system must be a string when provided.");
  }

  if (body.model !== undefined && typeof body.model !== "string") {
    throw new Error("model must be a string when provided.");
  }

  return {
    prompt: body.prompt.trim(),
    system: typeof body.system === "string" ? body.system : undefined,
    maxTokens: typeof body.maxTokens === "number" ? body.maxTokens : undefined,
    temperature: typeof body.temperature === "number" ? body.temperature : undefined,
    model: typeof body.model === "string" ? body.model : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const body = parseBody((await request.json()) as ClaudeRequestBody);
    const { message, text } = await createClaudeCompletion(body);

    return NextResponse.json({
      model: message.model ?? body.model ?? getClaudeModel(),
      text,
      stopReason: message.stop_reason,
      usage: message.usage,
      content: message.content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      message.startsWith("The request body") || message.includes("must be")
        ? 400
        : 500;

    return NextResponse.json(
      {
        error: "claude_request_failed",
        message,
      },
      { status },
    );
  }
}
