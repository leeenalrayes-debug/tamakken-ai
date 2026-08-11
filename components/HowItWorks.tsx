"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ClipboardList, Sparkles, Repeat } from "lucide-react";

import { useLanguage } from "@/lib/i18n";

const STEP_ICONS = [ClipboardList, Sparkles, Repeat];

/**
 * HowItWorks
 *
 * Describes the app's real, existing flow — form → generation → continue
 * practice — nothing invented beyond what the product actually does.
 */
function HowItWorks() {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();
  const STEPS = t.howItWorks.steps.map((step, index) => ({
    ...step,
    icon: STEP_ICONS[index],
  }));

  return (
    <section id="how-it-works" className="bg-cream-50 py-20 sm:py-28">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:gap-16 lg:px-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
            {t.howItWorks.badge}
          </div>
          <h2 className="text-3xl font-semibold tracking-tight text-brand-900 sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-slate-600">
            {t.howItWorks.subtitle}
          </p>
        </motion.div>

        <div className="space-y-5">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.45,
                delay: shouldReduceMotion ? 0 : index * 0.08,
                ease: "easeOut",
              }}
              className="flex items-start gap-4 rounded-2xl border border-brand-900/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(8,58,50,0.04),0_12px_28px_-16px_rgba(8,58,50,0.12)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <step.icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(HowItWorks);
