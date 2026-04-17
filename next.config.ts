import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@aptos-labs/ts-sdk", "classic-level"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      crypto: false,
      stream: false,
      path: false,
    };
    return config;
  },
  experimental: {}
};

export default nextConfig;
