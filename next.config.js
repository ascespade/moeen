/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://api.supabase.co",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // Image optimization
  images: {
    domains: ["localhost", "your-domain.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
  },

  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }
    return config;
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },

  // Output configuration for Docker
  output: 'standalone',
};

module.exports = nextConfig;