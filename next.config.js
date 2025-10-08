/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Enable Next image optimization in production
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Faster cold starts and smaller server bundle
  output: 'standalone',

  // Reduce client bundle via optimized package imports when possible
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  productionBrowserSourceMaps: false,

  compress: true,

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20_000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }

    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 500,
        ignored: /node_modules/,
      };
    }

    return config;
  },
};

// Bundle analyzer (opt-in with ANALYZE=true)
const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' });
module.exports = withBundleAnalyzer(nextConfig);
