import type { NextConfig } from "next";

// Security headers applied to all routes.
// CSP is strict but allows inline styles (Tailwind runtime) and images from Aptos/BSP endpoints.
// Adjust REGISTRY_HOST via NEXT_PUBLIC_BSP_REGISTRY_URL if you need to connect to additional hosts.
const REGISTRY_HOST = process.env.NEXT_PUBLIC_BSP_REGISTRY_URL
  ? new URL(process.env.NEXT_PUBLIC_BSP_REGISTRY_URL).origin
  : "https://api.biologicalsovereigntyprotocol.com";

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "object-src 'none'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  // Next.js needs 'unsafe-inline' for its bootstrap script and Tailwind's runtime styles.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${REGISTRY_HOST} https://fullnode.mainnet.aptoslabs.com https://fullnode.testnet.aptoslabs.com wss:`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {},
};

export default nextConfig;
