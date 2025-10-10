const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');

module.exports = {
  webpack: (config, { isServer, dev }) => {
    if (process.env.ANALYZE === 'true') {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: isServer
            ? path.join(__dirname, '../analyze/server.html')
            : path.join(__dirname, '../analyze/client.html'),
          generateStatsFile: true,
          statsFilename: isServer
            ? path.join(__dirname, '../analyze/server.json')
            : path.join(__dirname, '../analyze/client.json'),
          defaultSizes: 'gzip',
        })
      );
    }

    // Enhanced bundle optimization
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](@headlessui|lucide-react)[\\/]/,
            name: 'ui',
            priority: 15,
            chunks: 'all',
          },
          utils: {
            test: /[\\/]node_modules[\\/](clsx|class-variance-authority)[\\/]/,
            name: 'utils',
            priority: 10,
            chunks: 'all',
          },
        },
      };
    }

    return config;
  },
};