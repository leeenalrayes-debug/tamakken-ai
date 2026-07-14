import { NextRequest, NextResponse } from "next/server";

import { generateInterviewRequestSchema } from "@/lib/validation";
import { generateInterviewContent, LlamaServiceError } from "@/services/llama";
import type { ApiErrorResponse } from "@/types/interview";

/**
 * POST /api/interview
 *
 * Accepts { jobTitle, experienceLevel, jobDescription? }, validates it,
 * generates interview questions via the Llama API, and returns
 * { summary, questions } as structured JSON. Called by the frontend via
 * hooks/useInterview.ts.
 */
export async function POST(request: NextRequest) {
  // 1. Parse the request body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON in request body.", 400);
  }

  // 2. Validate and sanitize input.
  const parsed = generateInterviewRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return errorResponse(
      firstIssue?.message ?? "Invalid request.",
      400,
      parsed.error.flatten()
    );
  }

  // 3. Generate content via the Llama API (includes one automatic retry
  //    on invalid JSON, handled inside services/llama.ts).
  try {
    const result = await generateInterviewContent(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleGenerationError(error);
  }
}

function handleGenerationError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof LlamaServiceError) {
    switch (error.type) {
      case "config":
        // Server misconfiguration — log details server-side only, never
        // expose them (they could reference which env vars are missing).
        console.error("Llama service configuration error:", error.message);
        return errorResponse(
          "The interview generation service is not configured correctly. Please try again later.",
          500
        );

      case "timeout":
        return errorResponse(
          "The request took too long to complete. Please try again.",
          504
        );

      case "network":
        return errorResponse(
          "Unable to reach the interview generation service. Please try again.",
          502
        );

      case "invalid_response":
        return errorResponse(
          "Unable to generate interview questions. Please try again.",
          502
        );

      case "api_error":
        console.error(
          "Llama API error:",
          error.message,
          "status:",
          error.status
        );
        return errorResponse(
          "The interview generation service returned an error. Please try again.",
          502
        );
    }
  }

  console.error("Unexpected error in POST /api/interview:", error);
  return errorResponse("Something went wrong. Please try again.", 500);
}

function errorResponse(
  message: string,
  status: number,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    details !== undefined ? { error: message, details } : { error: message },
    { status }
  );
}
