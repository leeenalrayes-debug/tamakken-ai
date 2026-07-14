"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import GenerateIntro from "@/components/GenerateIntro";
import InterviewForm from "@/components/InterviewForm";
import QuestionAccordion from "@/components/QuestionAccordion";
import ContinuePractice from "@/components/ContinuePractice";
import Footer from "@/components/Footer";
import { useInterview } from "@/hooks/useInterview";

/**
 * Home page — composes the single-page AI Interview Coach experience and
 * wires the form to the real backend via useInterview (POST /api/interview).
 * Redesigned UI only: section layout and branding changed, the
 * generation logic and API contract are untouched.
 */
export default function HomePage() {
  const { status, data, error, isLoading, isRegenerating, generate, continuePractice } =
    useInterview();
  const shouldReduceMotion = useReducedMotion();

  // Shown once a result exists. While a fresh (non-regenerate) request is
  // loading, results stay hidden exactly as before. While a "Continue
  // Practice" request is in flight, the previous results stay visible so
  // the Continue Practice card can show its own loading state in place.
  const showResults = data !== null && (status === "success" || isRegenerating);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />

        <section id="generate" className="bg-white py-20 sm:py-28">
          <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
            <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16">
              <GenerateIntro />
              <InterviewForm
                onGenerate={generate}
                isLoading={isLoading}
                submissionError={status === "error" ? error : null}
              />
            </div>

            <AnimatePresence>
              {showResults && data ? (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-16 sm:mt-20"
                >
                  <QuestionAccordion summary={data.summary} questions={data.questions} />
                  <ContinuePractice onContinue={continuePractice} isLoading={isLoading} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
