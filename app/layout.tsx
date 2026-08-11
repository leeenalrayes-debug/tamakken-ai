import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "@/styles/globals.css";

import { LanguageProvider } from "@/lib/i18n";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n/config";

export const metadata: Metadata = {
  title: "Tamakken AI — AI Interview Coach",
  description:
    "Practice smarter with AI-generated interview questions and personalized feedback.",
};

// System font stack tuned to read like Inter/SF Pro without an external
// font fetch — keeps builds reliable in network-restricted environments
// while matching the Linear/Stripe/Vercel aesthetic closely.
const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Roboto,'Helvetica Neue',Arial,sans-serif";

// Self-hosted (downloaded at build time, no runtime request to Google
// Fonts) premium Arabic typeface, applied only when Arabic is active — see
// `[dir="rtl"] body` in globals.css. English keeps the FONT_STACK above.
// `preload: false` since it's only needed for the Arabic UI, not every
// visitor's initial (English) paint.
const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  preload: false,
  display: "swap",
});

// Applies the persisted language's dir/lang before first paint so there is
// no flash of the wrong direction while LanguageProvider hydrates.
const SET_INITIAL_DIRECTION_SCRIPT = `(function(){try{var l=localStorage.getItem(${JSON.stringify(
  LOCALE_STORAGE_KEY
)});if(l==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl";}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={arabicFont.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: SET_INITIAL_DIRECTION_SCRIPT }} />
      </head>
      <body
        className="min-h-screen bg-cream-50 text-slate-900 antialiased"
        style={{ "--font-sans": FONT_STACK } as React.CSSProperties}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
