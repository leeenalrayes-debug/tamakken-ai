"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

import { useLanguage } from "@/lib/i18n";

interface ErrorAlertProps {
  message: string | null;
  onDismiss?: () => void;
  id?: string;
}

/**
 * ErrorAlert
 *
 * Reusable inline alert banner for validation and request errors, e.g.
 * "Please enter a Job Title." or "Unable to generate interview questions."
 * Renders nothing when `message` is null/empty. Pass `id` to wire it up as
 * an `aria-describedby` target for the related form field(s).
 */
export default function ErrorAlert({ message, onDismiss, id }: ErrorAlertProps) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  return (
    <AnimatePresence initial={false}>
      {message ? (
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div
            id={id}
            role="alert"
            className="mt-4 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3 shadow-sm shadow-red-900/[0.02]"
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              aria-hidden
            />
            <p className="flex-1 text-sm leading-relaxed text-red-700">
              {message}
            </p>
            {onDismiss ? (
              <button
                type="button"
                onClick={onDismiss}
                aria-label={t.errorAlert.dismiss}
                className="shrink-0 rounded-md p-1 text-red-400 transition-colors hover:bg-red-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
