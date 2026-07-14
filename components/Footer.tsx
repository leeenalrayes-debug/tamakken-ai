import { memo } from "react";

import Logo from "@/components/Logo";

/**
 * Footer
 *
 * Simple, premium footer — brand mark and attribution only. No links,
 * real or fake, beyond the brand itself.
 */
function Footer() {
  return (
    <footer id="about" className="mt-20 border-t border-brand-900/[0.06] bg-cream-50 sm:mt-28">
      <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row sm:px-8 lg:px-10">
        <Logo />
        <p className="text-sm text-slate-500">Powered by Meta</p>
      </div>
    </footer>
  );
}

export default memo(Footer);
