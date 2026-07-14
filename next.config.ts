import type { NextConfig } from "next";

/**
 * Next.js configuration for AI Interview Coach.
 *
 * Notes:
 * - No database is used in this project; all state is either client-side
 *   or ephemeral, request-scoped server state.
 * - The Llama API key must never be exposed to the client. All calls to
 *   services/llama.ts must happen from server-side code (Route Handlers,
 *   Server Actions, or Server Components).
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Keep server-only packages out of the client bundle if/when added later
  // (e.g. an official Llama SDK). Extend this list as needed.
  serverExternalPackages: [],

  eslint: {
    // Linting is run explicitly via `npm run lint` / CI, not blocking builds here.
    ignoreDuringBuilds: false,
  },

  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
