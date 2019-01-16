const withSass = require('@zeit/next-sass');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const nextConfig = withSass({
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      use: 'raw-loader',
    });
    return config;
  }
});

nextConfig.exportPathMap = () => {
  return {
    '/': { page: '/' },
  };
};

module.exports = nextConfig;
