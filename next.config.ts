import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "**",
      }
    ]
  },
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg", "sslcommerz-lts", "node-fetch"],
};

export default nextConfig;