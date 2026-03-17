import Anthropic from "@anthropic-ai/sdk";
import type { Message } from "@anthropic-ai/sdk/resources/messages/messages";

const DEFAULT_MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

function getAnthropicApiKey() {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY. Add it to .env.local before calling Claude.");
  }

  return apiKey;
}

export function getClaudeModel() {
  return process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL;
}

function getClaudeClient() {
  client ??= new Anthropic({
    apiKey: getAnthropicApiKey(),
  });

  return client;
}

export function getClaudeText(message: Message) {
  return message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n\n")
    .trim();
}

type ClaudeCompletionParams = {
  prompt: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
};

export async function createClaudeCompletion({
  prompt,
  system,
  maxTokens = 1024,
  temperature,
  model,
}: ClaudeCompletionParams) {
  const message = await getClaudeClient().messages.create({
    model: model ?? getClaudeModel(),
    max_tokens: maxTokens,
    ...(system ? { system } : {}),
    ...(typeof temperature === "number" ? { temperature } : {}),
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return {
    message,
    text: getClaudeText(message),
  };
}
