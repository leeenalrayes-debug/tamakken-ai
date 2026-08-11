import type { GenerateInterviewResponse, InterviewLanguage } from "@/types/interview";

/**
 * Server-side content-quality validation for AI-generated interview
 * responses - a second, independent layer on top of the Zod shape
 * validation in lib/validation.ts. Zod guarantees the JSON has the right
 * shape and non-empty strings; this module inspects the actual text for
 * problems an LLM can still produce despite a well-formed response:
 * corrupted Unicode, mixed-language artifacts, and repeated content.
 *
 * Isolated non-Arabic contamination (a handful of stray foreign words) is
 * sanitized in place rather than failing the whole response — see
 * sanitizeNonArabicTokens and MAX_SANITIZABLE_FOREIGN_TOKENS. Corrupted
 * Unicode, blank fields, duplicated content, and widespread contamination
 * still fail validation so the caller regenerates, exactly as before.
 *
 * Pure and dependency-free by design so it stays easy to reuse and unit
 * test independently of the Llama service that calls it.
 */

/**
 * Technical terms/product names allowed to appear in Latin script inside
 * an otherwise-Arabic response. Matched as whole word tokens
 * (case-insensitive) against runs of letters, so multi-word/dotted names
 * like "Power BI", "Next.js", and "Node.js" are covered by their
 * individual parts ("power" + "bi", "next" + "js", "node" + "js").
 *
 * Includes "api" and "figma", which the existing prompt
 * (utils/promptBuilder.ts, intentionally left unchanged) already tells
 * the model are acceptable - excluding them here would reject
 * otherwise-compliant output and defeat the retry loop.
 */
const ALLOWED_TECH_TERMS = new Set(
  [
    "sql",
    "python",
    "java",
    "javascript",
    "typescript",
    "react",
    "next",
    "node",
    "js",
    "power",
    "bi",
    "excel",
    "tableau",
    "git",
    "github",
    "azure",
    "aws",
    "docker",
    "api",
    "figma",
  ].map((term) => term.toLowerCase())
);

/** Builds a string of the characters from charCode start to end, inclusive. */
function charRange(start: number, end: number): string {
  let result = "";
  for (let code = start; code <= end; code++) {
    result += String.fromCharCode(code);
  }
  return result;
}

// The Unicode replacement character (U+FFFD), produced when text is
// decoded with the wrong encoding.
const REPLACEMENT_CHARACTER = String.fromCharCode(0xfffd);

// Control characters that should never appear in generated text - the same
// set lib/validation.ts's sanitizeText already strips defensively, built
// from numeric character codes (rather than literal escape sequences in
// the source) so no raw control bytes live in this file. Kept in sync
// with that list since this module detects rather than silently strips.
const CONTROL_CHARACTERS =
  charRange(0x00, 0x08) + charRange(0x0b, 0x0c) + charRange(0x0e, 0x1f) + charRange(0x7f, 0x7f);

const CORRUPTED_UNICODE_PATTERN = new RegExp(
  "[" + REPLACEMENT_CHARACTER + CONTROL_CHARACTERS + "]"
);

// Lone (unpaired) UTF-16 surrogate code units - a hallmark of malformed
// encoding. Written with charCodeAt-safe numeric escapes since these are
// themselves surrogate values.
const UNPAIRED_SURROGATE_PATTERN = new RegExp(
  "[\\uD800-\\uDBFF](?![\\uDC00-\\uDFFF])|(?<![\\uD800-\\uDBFF])[\\uDC00-\\uDFFF]"
);

export interface ValidationIssue {
  /** Dot/bracket path to the offending field, e.g. "questions[2].idealAnswer". */
  field: string;
  reason:
    | "empty"
    | "corrupted_unicode"
    | "unexpected_non_arabic_text"
    | "duplicated";
  /** Extra context - e.g. the disallowed tokens found. */
  detail?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  /**
   * The response to actually use going forward. Identical to the input
   * unless isolated non-Arabic contamination was found and stripped out
   * (see MAX_SANITIZABLE_FOREIGN_TOKENS) — callers should use this instead
   * of their original response whenever `valid` is true.
   */
  sanitized: GenerateInterviewResponse;
}

/**
 * Above this many total foreign-language word occurrences across the
 * whole response, contamination is treated as widespread/structural
 * rather than a few stray tokens, and the response is rejected for
 * regeneration instead of being sanitized in place. Chosen to match "a
 * handful of isolated words" — a handful gets cleaned up; a response
 * riddled with foreign text throughout still gets discarded.
 */
const MAX_SANITIZABLE_FOREIGN_TOKENS = 5;

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

function hasCorruptedUnicode(value: string): boolean {
  return (
    CORRUPTED_UNICODE_PATTERN.test(value) || UNPAIRED_SURROGATE_PATTERN.test(value)
  );
}

/**
 * Returns any runs of letters in `value` that are neither Arabic script
 * nor an allowed technical term - i.e. stray English words, accented
 * Latin characters, or letters from any other script (Chinese, Thai,
 * Vietnamese, etc.), all of which show up as the same kind of artifact: a
 * run of Unicode letters outside the Arabic block.
 */
function findDisallowedNonArabicTokens(value: string): string[] {
  const letterRuns = value.match(/\p{L}+/gu) ?? [];
  return letterRuns.filter((run) => {
    if (/^\p{Script=Arabic}+$/u.test(run)) return false;
    return !ALLOWED_TECH_TERMS.has(run.toLowerCase());
  });
}

/**
 * Escapes regex metacharacters in a literal string for safe use inside
 * `new RegExp(...)`. Defensive only — `\p{L}+` matches don't actually
 * contain metacharacters, but this guards against that assumption ever
 * changing.
 */
function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Arabic replacements for the specific foreign words/roots observed
 * during testing (Vietnamese "chiến lược" / "khả năng", Chinese "開始" /
 * "開発", Korean "비교", and Cyrillic "стратег-" / "глуб-" roots that the
 * model occasionally glues directly onto an Arabic suffix). Plain
 * deletion leaves a grammatical gap — e.g. "...المناسبة هي" instead of
 * "...الاستراتيجية المناسبة هي" — so a known word is translated in place
 * instead of removed. A word's *partner* half in a two-word foreign term
 * (e.g. "lược" in "chiến lược") maps to "" since its meaning is already
 * carried by the other half. Anything not listed here still falls back
 * to plain removal, exactly as before.
 */
const KNOWN_FOREIGN_WORD_REPLACEMENTS: Record<string, string> = {
  "chiến": "الاستراتيجية", // Vietnamese "chiến lược" = "strategy"
  "lược": "",
  "khả": "القدرة", // Vietnamese "khả năng" = "ability/capacity"
  "năng": "",
  "đáp": "", // Vietnamese fragment ("đáp ứng" = "to meet/satisfy"), no clean standalone translation
  "開始": "البدء", // Chinese "begin/start"
  "開発": "التطوير", // Chinese "development"
  "비교": "المقارنة", // Korean "comparison"
  "стратег": "استراتيج", // Russian root, "strategy/strategic"
  "глуб": "عميق", // Russian root, "deep"
};

/**
 * Looks up a natural Arabic replacement for a disallowed token: an exact
 * (case-insensitive) match first, then a prefix match for hybrid tokens
 * where a known foreign root got glued directly onto an Arabic suffix
 * with no space (e.g. "стратегياتهم" -> "استراتيجتهم", keeping the "تهم"
 * suffix). Returns undefined — meaning "just remove it" — if nothing
 * matches.
 */
function lookupForeignWordReplacement(token: string): string | undefined {
  const lower = token.toLowerCase();
  if (lower in KNOWN_FOREIGN_WORD_REPLACEMENTS) {
    return KNOWN_FOREIGN_WORD_REPLACEMENTS[lower];
  }
  for (const [root, replacement] of Object.entries(KNOWN_FOREIGN_WORD_REPLACEMENTS)) {
    if (root.length === 0) continue;
    if (lower.startsWith(root)) {
      return replacement + token.slice(root.length);
    }
    if (lower.endsWith(root)) {
      return token.slice(0, token.length - root.length) + " " + replacement;
    }
  }
  return undefined;
}

/**
 * Strips isolated non-Arabic contamination out of `value` rather than
 * rejecting the whole field: every occurrence of each disallowed token
 * found by findDisallowedNonArabicTokens is either translated in place
 * (see KNOWN_FOREIGN_WORD_REPLACEMENTS) or, if it's not a recognized
 * word, removed — then the whitespace/punctuation left behind is tidied
 * up so the surrounding Arabic sentence reads naturally. Returns the
 * cleaned text and how many token occurrences were found, so the caller
 * can decide whether this was a handful of stray words (safe to salvage)
 * or pervasive corruption (not — see MAX_SANITIZABLE_FOREIGN_TOKENS).
 */
function sanitizeNonArabicTokens(value: string): { text: string; removedCount: number } {
  const disallowed = findDisallowedNonArabicTokens(value);
  if (disallowed.length === 0) {
    return { text: value, removedCount: 0 };
  }

  let cleaned = value;
  for (const token of disallowed) {
    const replacement = lookupForeignWordReplacement(token) ?? "";
    cleaned = cleaned.replace(new RegExp(escapeForRegExp(token), "gu"), replacement);
  }

  cleaned = cleaned
    .replace(/[ \t]+/g, " ") // collapse gaps left behind by removed words
    .replace(/\s+([،؛,.!؟?])/gu, "$1") // no space before punctuation
    .trim();

  return { text: cleaned, removedCount: disallowed.length };
}

/** True if any two (trimmed, whitespace-collapsed, case-insensitive) entries are identical. */
function hasExactDuplicate(values: string[]): boolean {
  const normalized = values.map((v) => v.trim().replace(/\s+/g, " ").toLowerCase());
  const seen = new Set<string>();
  for (const value of normalized) {
    if (value.length === 0) continue;
    if (seen.has(value)) return true;
    seen.add(value);
  }
  return false;
}

/**
 * Validates a single text field and returns the value to actually use
 * going forward — unchanged, unless it's an Arabic field with isolated
 * non-Arabic contamination, in which case the offending tokens are
 * stripped and `foreignTokenCounter` is incremented by however many were
 * removed. Blank and corrupted-Unicode fields still push a hard-reject
 * issue exactly as before — sanitization only ever applies to language
 * purity, per the other checks being left untouched.
 */
function processField(
  field: string,
  value: string,
  checkLanguagePurity: boolean,
  issues: ValidationIssue[],
  foreignTokenCounter: { count: number }
): string {
  if (isBlank(value)) {
    issues.push({ field, reason: "empty" });
    return value;
  }

  if (hasCorruptedUnicode(value)) {
    issues.push({ field, reason: "corrupted_unicode" });
    return value;
  }

  if (!checkLanguagePurity) {
    return value;
  }

  const { text, removedCount } = sanitizeNonArabicTokens(value);
  if (removedCount === 0) {
    return value;
  }

  foreignTokenCounter.count += removedCount;

  if (isBlank(text)) {
    // Sanitizing removed the field's entire content — nothing salvageable.
    issues.push({ field, reason: "empty" });
    return value;
  }

  return text;
}

/**
 * Validates a fully Zod-parsed interview response for production-quality
 * issues that shape validation alone can't catch: corrupted/malformed
 * Unicode, mixed-language artifacts in Arabic responses (anything outside
 * Arabic script that isn't an approved technical term), and duplicated
 * questions/answers across the generated questions.
 *
 * Language-purity contamination is sanitized in place rather than
 * rejecting the whole response: isolated foreign words are stripped out
 * (see sanitizeNonArabicTokens) and the cleaned text is returned via
 * `sanitized`. The response is only rejected for regeneration — same as
 * the other checks below — when contamination is widespread (more than
 * MAX_SANITIZABLE_FOREIGN_TOKENS occurrences across the whole response).
 *
 * Call sites (services/llama.ts) should use `sanitized` when `valid` is
 * true, and discard + regenerate exactly as before when it's false.
 */
export function validateInterviewResponse(
  response: GenerateInterviewResponse,
  language: InterviewLanguage | undefined
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const checkLanguagePurity = language === "ar";
  const foreignTokenCounter = { count: 0 };

  const summary = processField(
    "summary",
    response.summary,
    checkLanguagePurity,
    issues,
    foreignTokenCounter
  );

  const questions = response.questions.map((q, index) => {
    const question = processField(
      `questions[${index}].question`,
      q.question,
      checkLanguagePurity,
      issues,
      foreignTokenCounter
    );
    const idealAnswer = processField(
      `questions[${index}].idealAnswer`,
      q.idealAnswer,
      checkLanguagePurity,
      issues,
      foreignTokenCounter
    );
    const whyStrong = q.whyStrong.map((point, i) =>
      processField(
        `questions[${index}].whyStrong[${i}]`,
        point,
        checkLanguagePurity,
        issues,
        foreignTokenCounter
      )
    );
    const howToPersonalize = q.howToPersonalize.map((point, i) =>
      processField(
        `questions[${index}].howToPersonalize[${i}]`,
        point,
        checkLanguagePurity,
        issues,
        foreignTokenCounter
      )
    );

    if (whyStrong.filter((s) => !isBlank(s)).length < 2) {
      issues.push({ field: `questions[${index}].whyStrong`, reason: "empty" });
    }
    if (howToPersonalize.filter((s) => !isBlank(s)).length < 2) {
      issues.push({ field: `questions[${index}].howToPersonalize`, reason: "empty" });
    }

    return { question, idealAnswer, whyStrong, howToPersonalize };
  });

  if (hasExactDuplicate(questions.map((q) => q.question))) {
    issues.push({ field: "questions[].question", reason: "duplicated" });
  }
  if (hasExactDuplicate(questions.map((q) => q.idealAnswer))) {
    issues.push({ field: "questions[].idealAnswer", reason: "duplicated" });
  }

  if (checkLanguagePurity && foreignTokenCounter.count > MAX_SANITIZABLE_FOREIGN_TOKENS) {
    issues.push({
      field: "response",
      reason: "unexpected_non_arabic_text",
      detail: `${foreignTokenCounter.count} foreign-language word occurrences found — too widespread to sanitize safely`,
    });
  }

  return {
    valid: issues.length === 0,
    issues,
    sanitized: { summary, questions },
  };
}
