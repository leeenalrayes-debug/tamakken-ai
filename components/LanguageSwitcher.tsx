"use client";

import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * LanguageSwitcher
 *
 * Compact EN / العربية toggle. Switching updates the LanguageProvider
 * context, which instantly re-renders translated copy and flips
 * <html dir> for RTL layout.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.languageSwitcher.label}
      className={cn(
        "inline-flex items-center rounded-full border border-brand-200 bg-white p-0.5 shadow-sm",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          locale === "en"
            ? "bg-brand-600 text-white"
            : "text-slate-600 hover:text-brand-700"
        )}
      >
        {t.languageSwitcher.en}
      </button>
      <button
        type="button"
        onClick={() => setLocale("ar")}
        aria-pressed={locale === "ar"}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
          locale === "ar"
            ? "bg-brand-600 text-white"
            : "text-slate-600 hover:text-brand-700"
        )}
      >
        {t.languageSwitcher.ar}
      </button>
    </div>
  );
}
