/**
 * Generate Interview API contract — POST /api/interview
 *
 * The single source of truth for this shape, shared by the frontend
 * (components/InterviewForm.tsx, hooks/useInterview.ts) and the backend
 * (lib/validation.ts, utils/promptBuilder.ts, services/llama.ts,
 * app/api/interview/route.ts).
 */

/** Must stay in sync with the Select options rendered in InterviewForm. */
export const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Lead",
  "Manager",
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export interface GenerateInterviewRequest {
  jobTitle: string;
  experienceLevel: ExperienceLevel;
  jobDescription?: string;
  /**
   * When true, the prompt asks for a fresh set of 5 questions distinct
   * from any generated earlier in the session ("Continue Practice").
   * Optional and defaults to unset — the original single-generation flow
   * is unaffected.
   */
  regenerate?: boolean;
}

export interface GeneratedInterviewQuestion {
  question: string;
  idealAnswer: string;
  tip: string;
}

/** Exactly 5 questions, enforced by lib/validation.ts's response schema. */
export interface GenerateInterviewResponse {
  summary: string;
  questions: GeneratedInterviewQuestion[];
}

export interface ApiErrorResponse {
  error: string;
  details?: unknown;
}
