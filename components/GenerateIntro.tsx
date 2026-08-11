"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BarChart3, Sparkles } from "lucide-react";

import { useLanguage } from "@/lib/i18n";

/**
 * GenerateIntro
 *
 * Left-column copy and illustration for the "Generate Questions" section.
 * Purely presentational — the real form and its logic live in
 * InterviewForm.tsx, unchanged, in the column beside this one.
 */
function GenerateIntro() {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
        <Sparkles className="h-3 w-3" aria-hidden />
        {t.generateIntro.badge}
      </div>

      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-brand-900 sm:text-4xl">
        {t.generateIntro.titleLine1}
        <br />
        {t.generateIntro.titleLine2}
      </h2>

      <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-600">
        {t.generateIntro.description}
      </p>

      {/* 3D-style illustration: stacked cards evoking "generated
          questions", built from existing icon language (AI, sparkles,
          results) — decorative only, not a fake feature. */}
      <div className="relative mt-10 h-40 w-52" aria-hidden>
        <div className="absolute left-6 top-6 h-28 w-28 -rotate-6 rounded-2xl bg-brand-700 shadow-lg shadow-brand-900/25" />
        <div className="absolute left-6 top-6 flex h-28 w-28 -rotate-6 items-center justify-center rounded-2xl">
          <span className="text-2xl font-bold tracking-tight text-cream-100">AI</span>
        </div>

        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 top-16 flex h-14 w-14 rotate-6 items-center justify-center rounded-xl bg-white shadow-md shadow-brand-900/15"
        >
          <Sparkles className="h-6 w-6 text-brand-600" />
        </motion.div>

        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute right-0 top-2 flex h-16 w-16 rotate-12 items-center justify-center rounded-xl bg-cream-200 shadow-md shadow-brand-900/10"
        >
          <BarChart3 className="h-7 w-7 text-brand-700" />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default memo(GenerateIntro);
