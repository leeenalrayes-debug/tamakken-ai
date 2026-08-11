import { z } from "zod";

import { EXPERIENCE_LEVELS, INTERVIEW_LANGUAGES } from "@/types/interview";

/**
 * Zod schemas for the Generate Interview API (POST /api/interview).
 */

/**
 * Strips control characters and collapses runs of horizontal whitespace.
 * Newlines are preserved so multi-line job descriptions stay readable.
 * This is defense-in-depth input hygiene, not HTML/XSS escaping — the
 * value is only ever sent to the Llama API as plain text, never rendered
 * as HTML.
 */
function sanitizeText(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Request schema for POST /api/interview.
 *
 * Required: jobTitle, experienceLevel
 * Optional: jobDescription, regenerate
 */
export const generateInterviewRequestSchema = z.object({
  jobTitle: z
    .string({
      required_error: "Please enter a Job Title.",
      invalid_type_error: "Please enter a Job Title.",
    })
    .trim()
    .min(2, "Job Title must be at least 2 characters.")
    .max(120, "Job Title must be under 120 characters.")
    .transform(sanitizeText),
  experienceLevel: z.enum(EXPERIENCE_LEVELS, {
    errorMap: () => ({ message: "Please select your experience level." }),
  }),
  jobDescription: z
    .string()
    .trim()
    .max(5000, "Job Description must be under 5000 characters.")
    .transform(sanitizeText)
    .optional(),
  regenerate: z.boolean().optional(),
  language: z.enum(INTERVIEW_LANGUAGES).optional(),
});

export type GenerateInterviewRequestInput = z.infer<
  typeof generateInterviewRequestSchema
>;

/**
 * Expected JSON shape returned by the Llama API for an interview
 * generation request. Used to validate the model's output after parsing,
 * since LLM output is untrusted until proven otherwise.
 */
export const generatedQuestionSchema = z.object({
  question: z.string().trim().min(1),
  idealAnswer: z.string().trim().min(1),
  whyStrong: z.array(z.string().trim().min(1)).min(2).max(4),
  howToPersonalize: z.array(z.string().trim().min(1)).min(2).max(4),
});

export const generateInterviewResponseSchema = z.object({
  summary: z.string().trim().min(1),
  questions: z
    .array(generatedQuestionSchema)
    .length(3, "Expected exactly three interview questions."),
});

export type GenerateInterviewResponseOutput = z.infer<
  typeof generateInterviewResponseSchema
>;
