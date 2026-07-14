import { buildInterviewPrompt } from "@/utils/promptBuilder";
import { generateInterviewResponseSchema } from "@/lib/validation";
import type {
  GenerateInterviewRequest,
  GenerateInterviewResponse,
} from "@/types/interview";

/**
 * Meta Llama API service.
 *
 * Encapsulates all server-side communication with the Llama API for
 * interview question generation. This module must only ever be imported
 * from server-side code (Route Handlers, Server Actions, Server
 * Components) — it reads LLAMA_API_KEY from the environment and never
 * returns it or logs it.
 *
 * Calls an OpenAI-compatible chat completions endpoint:
 * `${LLAMA_BASE_URL}/chat/completions`. This works out of the box with
 * Groq (https://console.groq.com), which hosts Meta Llama models behind
 * an OpenAI-compatible API — see .env.example — as well as any other
 * OpenAI-compatible Llama provider. The retry, JSON extraction, and
 * validation logic below is provider-agnostic.
 */

const MAX_GENERATION_ATTEMPTS = 2; // initial attempt + 1 automatic retry

export type LlamaErrorType =
  | "config"
  | "network"
  | "timeout"
  | "invalid_response"
  | "api_error";

export class LlamaServiceError extends Error {
  readonly type: LlamaErrorType;
  readonly status?: number;

  constructor(type: LlamaErrorType, message: string, status?: number) {
    super(message);
    this.name = "LlamaServiceError";
    this.type = type;
    this.status = status;
  }
}

interface LlamaConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
  maxTokens: number;
  temperature: number;
  timeoutMs: number;
}

/**
 * Reads and validates required Llama API configuration from environment
 * variables. Throws a LlamaServiceError("config", ...) if anything
 * required is missing, rather than letting an unclear runtime error
 * surface later. Never includes the API key value in any error message.
 */
function getLlamaConfig(): LlamaConfig {
  const apiKey = process.env.LLAMA_API_KEY;
  const baseUrl = process.env.LLAMA_BASE_URL;
  const model = process.env.LLAMA_MODEL;

  const missing: string[] = [];
  if (!apiKey) missing.push("LLAMA_API_KEY");
  if (!baseUrl) missing.push("LLAMA_BASE_URL");
  if (!model) missing.push("LLAMA_MODEL");

  if (missing.length > 0) {
    throw new LlamaServiceError(
      "config",
      `Missing required environment variable(s): ${missing.join(", ")}.`
    );
  }

  const maxTokens = Number(process.env.LLAMA_MAX_TOKENS ?? 2048);
  const temperature = Number(process.env.LLAMA_TEMPERATURE ?? 0.7);
  const timeoutMs = Number(process.env.LLAMA_TIMEOUT_MS ?? 30000);

  return {
    apiKey: apiKey!,
    baseUrl: baseUrl!,
    model: model!,
    maxTokens: Number.isFinite(maxTokens) ? maxTokens : 2048,
    temperature: Number.isFinite(temperature) ? temperature : 0.7,
    timeoutMs: Number.isFinite(timeoutMs) ? timeoutMs : 30000,
  };
}

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

/**
 * Low-level call to the Llama API's chat completions endpoint.
 * Handles network failures and timeouts, and returns the raw text content
 * of the model's reply. Does not parse or validate JSON — that happens
 * one layer up, since retry-on-invalid-JSON needs to re-issue this call.
 */
async function callLlamaChatCompletion(
  messages: ChatMessage[]
): Promise<string> {
  const config = getLlamaConfig();
  const endpoint = `${config.baseUrl.replace(/\/+$/, "")}/chat/completions`;

  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), config.timeoutMs);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        stream: false,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new LlamaServiceError(
        "timeout",
        "The request to the AI provider timed out."
      );
    }
    throw new LlamaServiceError(
      "network",
      "Unable to reach the AI provider. Please check your connection and try again."
    );
  } finally {
    clearTimeout(timeoutHandle);
  }

  if (!response.ok) {
    // Deliberately generic: never forward the upstream response body,
    // which could contain provider-specific details we don't want to leak.
    throw new LlamaServiceError(
      "api_error",
      `The AI provider returned an error (status ${response.status}).`,
      response.status
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new LlamaServiceError(
      "invalid_response",
      "The AI provider returned a response that could not be read."
    );
  }

  const content = extractMessageContent(data);
  if (!content) {
    throw new LlamaServiceError(
      "invalid_response",
      "The AI provider response did not contain any content."
    );
  }

  return content;
}

/**
 * Extracts the assistant's text content from an OpenAI-compatible chat
 * completion response body: `choices[0].message.content`.
 */
function extractMessageContent(data: unknown): string | null {
  if (typeof data !== "object" || data === null) return null;
  const choices = (data as Record<string, unknown>).choices;
  if (!Array.isArray(choices) || choices.length === 0) return null;

  const first = choices[0];
  if (typeof first !== "object" || first === null) return null;

  const message = (first as Record<string, unknown>).message;
  if (typeof message !== "object" || message === null) return null;

  const content = (message as Record<string, unknown>).content;
  return typeof content === "string" && content.trim().length > 0
    ? content
    : null;
}

/**
 * Best-effort extraction of a JSON object from raw model output. Models
 * generally follow the "JSON only" instruction, but this defends against
 * accidental markdown code fences or stray leading/trailing text.
 */
function extractJsonPayload(raw: string): string {
  let text = raw.trim();

  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch?.[1]) {
    text = fenceMatch[1].trim();
  }

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  return text;
}

/**
 * Generates interview content for a validated request. Builds the prompt,
 * calls the Llama API, parses and validates the JSON response, and
 * automatically retries once (with a stricter prompt) if the response is
 * not valid JSON or doesn't match the expected shape. Throws
 * LlamaServiceError if it still fails after the retry.
 */
export async function generateInterviewContent(
  request: GenerateInterviewRequest
): Promise<GenerateInterviewResponse> {
  let lastError: LlamaServiceError | null = null;

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
    const { system, user } = buildInterviewPrompt(request, {
      strict: attempt > 1,
    });

    const rawContent = await callLlamaChatCompletion([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    const jsonPayload = extractJsonPayload(rawContent);

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonPayload);
    } catch {
      lastError = new LlamaServiceError(
        "invalid_response",
        "The AI provider did not return valid JSON."
      );
      continue;
    }

    const validated = generateInterviewResponseSchema.safeParse(parsed);
    if (!validated.success) {
      lastError = new LlamaServiceError(
        "invalid_response",
        "The AI provider returned data in an unexpected format."
      );
      continue;
    }

    return validated.data;
  }

  throw (
    lastError ??
    new LlamaServiceError(
      "invalid_response",
      "Unable to generate interview questions."
    )
  );
}
