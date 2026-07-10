import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma 7's client and the pg driver adapter must be loaded from
  // node_modules at runtime, not bundled by Turbopack — bundling them causes
  // "Cannot find module '.prisma/client/default'" errors in dev and build.
  //
  // sslcommerz-lts (and the node-fetch v2 it depends on internally) has the
  // same problem: Turbopack bundling it mangles node-fetch's CJS export,
  // producing "TypeError: fetch is not a function" when init() is called.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "sslcommerz-lts", "node-fetch"],
};

export default nextConfig;