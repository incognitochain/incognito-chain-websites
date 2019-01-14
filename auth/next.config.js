const withSass = require('@zeit/next-sass');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const nextConfig = withSass({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'raw-loader',
    });

    if (config.mode === 'production') {
      if (Array.isArray(config.optimization.minimizer)) {
        config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
      }
    }
    return config;
  }
});

nextConfig.exportPathMap = () => {
  return {
    '/': { page: '/' },
    '/login': { page: '/login' },
    '/register': { page: '/register' },
    '/forgot-password': { page: '/forgot-password' },
    '/reset-password': { page: '/reset-password' },
  };
};

module.exports = nextConfig;
