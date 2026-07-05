import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Prisma 7's client and the pg driver adapter must be loaded from
  // node_modules at runtime, not bundled by Turbopack — bundling them causes
  // "Cannot find module '.prisma/client/default'" errors in dev and build.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
};

export default nextConfig;