import type { Metadata } from "next";
import "@/styles/globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen bg-cream-50 text-slate-900 antialiased"
        style={{ fontFamily: FONT_STACK }}
      >
        {children}
      </body>
    </html>
  );
}
