import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the production app type checked without the independent Cloudflare
  // Worker adapter used by the private Sites backup.
  typescript: {
    tsconfigPath: "tsconfig.next.json",
  },
};

export default nextConfig;
