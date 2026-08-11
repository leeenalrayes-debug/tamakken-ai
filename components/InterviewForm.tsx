"use client";

import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ErrorAlert from "@/components/ErrorAlert";
import LoadingState from "@/components/LoadingState";
import { useLanguage } from "@/lib/i18n";
import type { Translations } from "@/lib/i18n";
import { EXPERIENCE_LEVELS } from "@/types/interview";

function buildInterviewFormSchema(t: Translations) {
  return z.object({
    jobTitle: z.string().trim().min(1, t.form.validation.jobTitleRequired),
    experienceLevel: z.enum(EXPERIENCE_LEVELS, {
      errorMap: () => ({ message: t.form.validation.experienceLevelRequired }),
    }),
    jobDescription: z.string().max(5000).optional(),
  });
}

export type InterviewFormValues = z.infer<ReturnType<typeof buildInterviewFormSchema>>;

interface InterviewFormProps {
  onGenerate: (values: InterviewFormValues) => void;
  isLoading: boolean;
  submissionError?: string | null;
}

/**
 * InterviewForm
 *
 * Centered card collecting job title, experience level, and an optional
 * job description, then triggers interview question generation. Validated
 * with Zod via React Hook Form; the single primary CTA on the page.
 */
export default function InterviewForm({
  onGenerate,
  isLoading,
  submissionError,
}: InterviewFormProps) {
  const { t } = useLanguage();
  const interviewFormSchema = useMemo(() => buildInterviewFormSchema(t), [t]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InterviewFormValues>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      jobTitle: "",
      jobDescription: "",
    },
  });
  const shouldReduceMotion = useReducedMotion();

  // Surface the first validation error through the shared ErrorAlert,
  // per the approved design (e.g. "Please enter a Job Title.").
  const firstValidationError =
    errors.jobTitle?.message ??
    errors.experienceLevel?.message ??
    errors.jobDescription?.message ??
    null;

  const displayedError = firstValidationError ?? submissionError ?? null;
  const errorId = "interview-form-error";

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <Card className="relative overflow-hidden p-7 sm:p-9">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent"
        />

        <CardHeader className="mb-7 space-y-1.5 p-0">
          <CardTitle>{t.form.cardTitle}</CardTitle>
          <CardDescription>{t.form.cardDescription}</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <form
            noValidate
            onSubmit={handleSubmit(onGenerate)}
            className="space-y-5 sm:space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="jobTitle">{t.form.jobTitleLabel}</Label>
              <Input
                id="jobTitle"
                placeholder={t.form.jobTitlePlaceholder}
                disabled={isLoading}
                invalid={!!errors.jobTitle}
                aria-describedby={displayedError ? errorId : undefined}
                {...register("jobTitle")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">{t.form.experienceLevelLabel}</Label>
              <Controller
                control={control}
                name="experienceLevel"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger
                      id="experienceLevel"
                      invalid={!!errors.experienceLevel}
                      aria-describedby={displayedError ? errorId : undefined}
                    >
                      <SelectValue placeholder={t.form.experienceLevelPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level} value={level}>
                          {t.experienceLevels[level]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">
                {t.form.jobDescriptionLabel}{" "}
                <span className="font-normal text-slate-400">
                  {t.form.optional}
                </span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder={t.form.jobDescriptionPlaceholder}
                disabled={isLoading}
                {...register("jobDescription")}
              />
            </div>

            <ErrorAlert id={errorId} message={displayedError} />

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              <Sparkles className="h-4 w-4" />
              {t.form.submitButton}
            </Button>

            {isLoading ? <LoadingState message={t.loading.generating} /> : null}
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
