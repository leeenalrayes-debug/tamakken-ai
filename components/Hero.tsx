"use client";

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

import PhoneMockup from "@/components/PhoneMockup";
import { useLanguage } from "@/lib/i18n";

/**
 * Hero
 *
 * Premium landing hero: badge, headline, description, and a feature
 * checklist on the left; a phone mockup of the real interview form with
 * floating decorative elements on the right. The single primary CTA
 * ("Start Practice") lives in the Header, not here.
 */
function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { t } = useLanguage();

  return (
    <section id="top" className="relative overflow-hidden bg-cream-50">
      {/* Soft ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-brand-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-[-6rem] h-72 w-72 rounded-full bg-brand-100/50 blur-3xl"
      />

      <div className="container relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-16 sm:px-8 md:grid-cols-2 md:py-24 lg:px-10">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-1.5 text-xs font-medium text-brand-700 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden />
            {t.hero.badge}
          </div>

          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-brand-900 sm:text-5xl lg:text-[3.4rem]">
            {t.hero.titleLine1}
            <br />
            {t.hero.titleLine2}
          </h1>

          <p className="mt-5 max-w-md text-base leading-relaxed text-slate-600 sm:text-lg">
            {t.hero.description}
          </p>

          <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {t.hero.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
              >
                <Check className="h-4 w-4 shrink-0 text-brand-600" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="relative mx-auto flex w-full max-w-sm items-center justify-center py-6"
        >
          {/* Orbit rings */}
          <div
            aria-hidden
            className="pointer-events-none absolute h-[22rem] w-[22rem] rounded-full border border-brand-300/40"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute h-[27rem] w-[27rem] animate-spin-slow rounded-full border border-dashed border-brand-300/30"
          />

          {/* Floating phone */}
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10"
          >
            <PhoneMockup />
          </motion.div>

          {/* AI cube */}
          <motion.div
            aria-hidden
            animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute left-0 top-10 z-20 flex h-14 w-14 rotate-[-8deg] items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white shadow-lg shadow-brand-900/30 sm:h-16 sm:w-16"
          >
            AI
          </motion.div>

          {/* Sparkle star */}
          <motion.svg
            aria-hidden
            animate={shouldReduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="absolute bottom-6 right-0 z-20 h-12 w-12 text-brand-600 sm:h-14 sm:w-14"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0c0 5.5 1 9 6.5 9-5.5 0-6.5 3.5-6.5 9 0-5.5-1-9-6.5-9C11 9 12 5.5 12 0Z" />
          </motion.svg>

          {/* Small floating stars/dots */}
          <span
            aria-hidden
            className="absolute right-6 top-4 h-2 w-2 animate-pulse rounded-full bg-brand-400"
          />
          <span
            aria-hidden
            className="absolute bottom-24 left-2 h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300"
            style={{ animationDelay: "0.6s" }}
          />
          <span
            aria-hidden
            className="absolute right-10 top-1/2 h-1.5 w-1.5 animate-pulse rounded-full bg-brand-400"
            style={{ animationDelay: "1.1s" }}
          />
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Hero);
