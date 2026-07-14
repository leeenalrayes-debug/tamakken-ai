"use client";

import { ChevronDown, Search, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";

/**
 * PhoneMockup
 *
 * A decorative recreation of the real interview generation form inside an
 * iPhone-style frame, for the hero. Shows only fields and copy that exist
 * in components/InterviewForm.tsx — Job Title, Experience Level, Job
 * Description, Generate Interview Questions — nothing invented. This is a
 * static illustration, not a live embed of the real form.
 */
export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[260px] sm:w-[280px]">
      {/* Phone frame */}
      <div className="relative rounded-[2.75rem] border-[6px] border-brand-900 bg-brand-900 shadow-[0_40px_80px_-20px_rgba(8,58,50,0.45)]">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-20 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-brand-900" />

        <div className="relative overflow-hidden rounded-[2.25rem] bg-cream-50">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-[10px] font-semibold text-slate-700">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            </span>
          </div>

          {/* App content */}
          <div className="space-y-4 px-4 pb-6 pt-2">
            <Logo className="scale-90" />

            <div>
              <p className="text-[15px] font-semibold leading-snug text-slate-900">
                Tell us about the role
              </p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500">
                We&apos;ll tailor your questions to match it.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-medium text-slate-500">Job Title</p>
              <div className="flex items-center rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                <Search className="h-3 w-3 text-slate-300" aria-hidden />
                <span className="ml-1.5 text-[11px] text-slate-400">
                  Software Engineer
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-medium text-slate-500">
                Experience Level
              </p>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                <span className="text-[11px] text-slate-400">
                  Select experience level
                </span>
                <ChevronDown className="h-3 w-3 text-slate-300" aria-hidden />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-medium text-slate-500">
                Job Description{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </p>
              <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                <span className="text-[11px] leading-snug text-slate-400">
                  Paste the job description here...
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-600 py-2.5 text-[11px] font-semibold text-white shadow-sm shadow-brand-900/30">
              <Sparkles className="h-3 w-3" aria-hidden />
              Generate Interview Questions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
