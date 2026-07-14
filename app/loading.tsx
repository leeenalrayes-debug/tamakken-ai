import { Loader2 } from "lucide-react";

/**
 * App Router route-level loading UI, shown during route-level navigation
 * / streaming. Distinct from components/LoadingState.tsx, which handles
 * the in-page interview generation request state — this file only
 * matters for route transitions, which this single-page app rarely
 * triggers, but it must still render something reasonable rather than
 * a blank screen if it ever does.
 */
export default function Loading() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-6 w-6 animate-spin text-brand-600" aria-hidden />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
