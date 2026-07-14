"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  /** Defaults to the original interview-generation copy. */
  message?: string;
}

/**
 * LoadingState
 *
 * Shown while interview questions are being generated. The form and
 * button are disabled by the parent while this is visible.
 */
export default function LoadingState({
  message = "Generating your interview questions...",
}: LoadingStateProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 py-6"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-5 w-5 animate-spin text-brand-600" aria-hidden />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </motion.div>
  );
}
