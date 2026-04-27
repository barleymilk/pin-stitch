import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pin-stitch/ui", "@pin-stitch/domain", "@pin-stitch/config"]
};

export default nextConfig;
