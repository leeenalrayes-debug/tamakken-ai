"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lightbulb, MessageSquare } from "lucide-react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { GeneratedInterviewQuestion } from "@/types/interview";

interface QuestionAccordionProps {
  summary: string;
  questions: GeneratedInterviewQuestion[];
}

/**
 * QuestionAccordion
 *
 * Displays the AI-generated interview summary and questions in a compact,
 * single-open accordion. Each item reveals the question's ideal answer
 * and a practical interview tip.
 */
export default function QuestionAccordion({
  summary,
  questions,
}: QuestionAccordionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto w-full max-w-2xl px-6 sm:px-8"
    >
      <div className="mb-6 sm:mb-8">
        <div className="mb-2 flex items-center gap-2.5">
          <h2 className="text-2xl font-semibold tracking-tight text-brand-900">
            Your Interview Questions
          </h2>
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            {questions.length}
          </span>
        </div>
        <p className="leading-relaxed text-slate-600">{summary}</p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {questions.map((q, index) => (
          <motion.div
            key={index}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: shouldReduceMotion ? 0 : index * 0.06,
              ease: "easeOut",
            }}
          >
            <AccordionItem value={`question-${index}`}>
              <AccordionTrigger>
                <span className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-semibold text-brand-700"
                  >
                    {index + 1}
                  </span>
                  <span>{q.question}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <div className="flex gap-2.5">
                    <MessageSquare
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ideal Answer
                      </p>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        {q.idealAnswer}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <Lightbulb
                      className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                      aria-hidden
                    />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Interview Tip
                      </p>
                      <p className="mt-1 leading-relaxed text-slate-600">
                        {q.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </motion.div>
  );
}
