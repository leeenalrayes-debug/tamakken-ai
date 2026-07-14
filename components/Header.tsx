"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "#top" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

/**
 * Header
 *
 * Sticky top navigation with smooth-scroll links to the page's existing
 * sections and the primary "Start Practice" CTA, which scrolls to the
 * real interview generation form — no new pages or routes.
 */
export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          aria-label="Tamakken AI — back to top"
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

        <div className="hidden md:block">
          <Button
            onClick={() => scrollTo("#generate")}
            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 shadow-brand-900/20"
          >
            Start Practice
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-brand-700 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
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
                className="rounded-lg px-2 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <Button
            onClick={() => scrollTo("#generate")}
            className="mt-3 w-full bg-brand-600 hover:bg-brand-700 active:bg-brand-800"
          >
            Start Practice
          </Button>
        </div>
      ) : null}
    </header>
  );
}
