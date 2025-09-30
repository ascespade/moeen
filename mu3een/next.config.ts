import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";
import path from "path";

const baseConfig: NextConfig = {
  // Ensure Next.js treats this folder as the workspace root
  outputFileTracingRoot: path.join(__dirname),
  // Basic optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Transpile specific packages from node_modules
  transpilePackages: ['preline'],

  // Image optimization
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Source maps
  productionBrowserSourceMaps: false,

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

const withAnalyzer = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

export default withAnalyzer(baseConfig);
