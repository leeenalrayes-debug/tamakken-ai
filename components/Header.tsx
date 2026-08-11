"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

/**
 * Header
 *
 * Sticky top navigation with smooth-scroll links to the page's existing
 * sections and the primary "Start Practice" CTA, which scrolls to the
 * real interview generation form — no new pages or routes.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguage();

  const NAV_LINKS = [
    { label: t.header.navHome, href: "#top" },
    { label: t.header.navHowItWorks, href: "#how-it-works" },
    { label: t.header.navAbout, href: "#about" },
  ];

  function scrollTo(href: string) {
    setMobileOpen(false);
    const id = href.replace("#", "");
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-900/[0.06] bg-cream-50/80 backdrop-blur-md">
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5 sm:px-8 lg:px-10">
        <button
          type="button"
          onClick={() => scrollTo("#top")}
          className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
          aria-label={t.header.logoAria}
        >
          <Logo />
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              type="button"
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 rounded-sm"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Button
            onClick={() => scrollTo("#generate")}
            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-brand-900/20"
          >
            {t.header.startPractice}
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-700 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={mobileOpen ? t.header.closeMenu : t.header.openMenu}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-brand-900/[0.06] bg-cream-50 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Primary mobile">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => scrollTo(link.href)}
                className="rounded-lg px-2 py-2.5 text-start text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <div className="mt-3 flex items-center justify-between gap-3 px-2">
            <LanguageSwitcher />
          </div>
          <Button
            onClick={() => scrollTo("#generate")}
            className="mt-3 w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800"
          >
            {t.header.startPractice}
          </Button>
        </div>
      ) : null}
    </header>
  );
}
