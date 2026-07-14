"use client";

import { useCallback, useRef, useState } from "react";

import type {
  ApiErrorResponse,
  GenerateInterviewRequest,
  GenerateInterviewResponse,
} from "@/types/interview";
import type { ApiResult, AsyncStatus } from "@/types/common";

const INTERVIEW_ENDPOINT = "/api/interview";
const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_ERROR_MESSAGE =
  "Unable to reach the server. Please check your connection and try again.";

export interface UseInterviewResult {
  status: AsyncStatus;
  data: GenerateInterviewResponse | null;
  error: string | null;
  isLoading: boolean;
  /**
   * True while a "Continue Practice" request (regenerate: true) is in
   * flight, as opposed to the original form submission. Lets the UI keep
   * showing the previous results while a new set loads.
   */
  isRegenerating: boolean;
  /** Submits a request to POST /api/interview and updates state accordingly. */
  generate: (input: GenerateInterviewRequest) => Promise<void>;
  /**
   * Re-submits the last successful request's job title, experience level,
   * and job description with `regenerate: true`, asking for five new
   * questions that don't repeat the previous set. No-op if nothing has
   * been generated yet.
   */
  continuePractice: () => Promise<void>;
  /** Resets to the idle state, clearing any prior result or error. */
  reset: () => void;
}

/**
 * useInterview
 *
 * Owns the lifecycle of a POST /api/interview request: submitting the
 * validated form values, tracking idle/loading/success/error state, and
 * exposing the generated { summary, questions } result to the UI.
 *
 * A request ID guard discards responses from a superseded request (e.g.
 * the user resubmits before the first call returns), so stale results
 * can never overwrite a newer one.
 */
export function useInterview(): UseInterviewResult {
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [data, setData] = useState<GenerateInterviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const requestIdRef = useRef(0);
  const lastInputRef = useRef<GenerateInterviewRequest | null>(null);

  const runGeneration = useCallback(
    async (input: GenerateInterviewRequest, regenerating: boolean) => {
      const requestId = ++requestIdRef.current;

      setStatus("loading");
      setError(null);
      setIsRegenerating(regenerating);

      const result = await submitInterviewRequest(input);

      // A newer request has since started; ignore this now-stale response.
      if (requestId !== requestIdRef.current) return;

      if (result.success) {
        setData(result.data);
        setStatus("success");
      } else {
        setError(result.error);
        setStatus("error");
      }
      setIsRegenerating(false);
    },
    []
  );

  const generate = useCallback(
    (input: GenerateInterviewRequest) => {
      // Store the base fields (never the regenerate flag itself) so
      // Continue Practice can reuse the same role/level/description
      // without asking the user to re-enter anything.
      lastInputRef.current = {
        jobTitle: input.jobTitle,
        experienceLevel: input.experienceLevel,
        jobDescription: input.jobDescription,
      };
      return runGeneration(input, false);
    },
    [runGeneration]
  );

  const continuePractice = useCallback(() => {
    const last = lastInputRef.current;
    if (!last) return Promise.resolve();
    return runGeneration({ ...last, regenerate: true }, true);
  }, [runGeneration]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setStatus("idle");
    setData(null);
    setError(null);
    setIsRegenerating(false);
  }, []);

  return {
    status,
    data,
    error,
    isLoading: status === "loading",
    isRegenerating,
    generate,
    continuePractice,
    reset,
  };
}

async function submitInterviewRequest(
  input: GenerateInterviewRequest
): Promise<ApiResult<GenerateInterviewResponse>> {
  let response: Response;
  try {
    response = await fetch(INTERVIEW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return { success: false, error: NETWORK_ERROR_MESSAGE };
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return { success: false, error: GENERIC_ERROR_MESSAGE };
  }

  if (!response.ok) {
    const message =
      isApiErrorResponse(body) && body.error ? body.error : GENERIC_ERROR_MESSAGE;
    return { success: false, error: message };
  }

  return { success: true, data: body as GenerateInterviewResponse };
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as Record<string, unknown>).error === "string"
  );
}
