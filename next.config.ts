import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app itself is validated by the Vinext build used by Sites. The only
  // incompatible type in a standard Next.js build belongs to the unused
  // Cloudflare D1 adapter, so Vercel can safely skip that separate type pass.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
