/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Disable image optimization in development for faster builds
  images: {
    unoptimized: true,
  },
  
  // Faster development builds
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Simple webpack config for dev
  webpack: (config, { dev }) => {
    if (dev) {
      // Faster rebuilds in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
}

module.exports = nextConfig
