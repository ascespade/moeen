import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic optimizations only
  compress: true,
  poweredByHeader: false,
  reactStrictMode: false,
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  // Disable source maps
  productionBrowserSourceMaps: false,
};

export default nextConfig;
