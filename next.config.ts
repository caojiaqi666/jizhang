import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all for now, user should restrict to Supabase domain later
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Explicitly disable Turbopack by forcing webpack for now, or handle it properly
  // But the error suggests it's using Turbopack by default and finding webpack config (from next-pwa likely)
  // So we can try to just add an empty turbopack object to silence it if we want to use Turbopack
  // OR we can run with --webpack flag.
  // Let's try the empty config first as suggested by the error message.
  experimental: {
    // turbopack: {} // Type definition might not be ready in this version for 'turbopack' directly on config root or experimental
  },
};

// next-pwa uses webpack, so it conflicts with Turbopack.
// We should run next with --webpack flag or disable pwa in dev (which we did)
// The error is "This build is using Turbopack, with a `webpack` config and no `turbopack` config."

export default withPWA(nextConfig);
