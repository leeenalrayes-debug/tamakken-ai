"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * App Router route-level error boundary. Catches uncaught rendering
 * errors anywhere in the page tree and shows a minimal, on-brand fallback
 * instead of a blank screen. Distinct from components/ErrorAlert.tsx,
 * which handles expected, recoverable form/API errors inline.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-6 w-6 text-red-500" aria-hidden />
      </div>
      <div className="space-y-1.5">
        <h1 className="text-lg font-semibold text-slate-900">
          Something went wrong
        </h1>
        <p className="max-w-sm text-sm text-slate-500">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <Button onClick={reset} variant="outline" size="sm">
        Try again
      </Button>
    </div>
  );
}
