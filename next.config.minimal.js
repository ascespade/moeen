/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  
  // Disable everything for speed
  images: {
    unoptimized: true,
  },
  
  // Minimal experimental features
  experimental: {
    optimizePackageImports: [],
  },
  
  // Ultra-fast webpack config
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
        ignored: /node_modules/,
      };
    }
    return config;
  },
}

module.exports = nextConfig

