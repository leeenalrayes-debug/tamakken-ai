"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/LoadingState";
import { useLanguage } from "@/lib/i18n";

interface ContinuePracticeProps {
  onContinue: () => void;
  isLoading: boolean;
}

/**
 * ContinuePractice
 *
 * Shown below the generated questions once a session completes. Lets the
 * user request another set of three questions for the same role/level
 * without re-entering any form data.
 */
function ContinuePractice({ onContinue, isLoading }: ContinuePracticeProps) {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.15 }}
      className="mx-auto mt-8 w-full max-w-2xl px-6 sm:px-8"
    >
      <Card className="relative overflow-hidden p-7 text-center sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-brand-100/50 blur-3xl"
        />

        <div className="relative">
          <p className="text-sm font-semibold text-brand-700">{t.continuePractice.greatJob}</p>

          <h3 className="mx-auto mt-2 max-w-sm text-xl font-semibold tracking-tight text-brand-900 sm:text-2xl">
            {t.continuePractice.heading}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            {t.continuePractice.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {t.continuePractice.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
              >
                <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden />
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <Button
              type="button"
              size="lg"
              onClick={onContinue}
              disabled={isLoading}
              className="w-full sm:w-auto sm:px-10"
            >
              {t.continuePractice.button}
            </Button>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {t.continuePractice.footnote}
          </p>

          {isLoading ? (
            <div className="mt-4">
              <LoadingState message={t.loading.regenerating} />
            </div>
          ) : null}
        </div>
      </Card>
    </motion.div>
  );
}

export default memo(ContinuePractice);
