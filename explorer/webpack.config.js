const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
// const PrepackWebpackPlugin = require('prepack-webpack-plugin').default;

const appPath = filepath => path.resolve(__dirname, filepath);
const appEnv = require('./.env.js');

module.exports = function webpackConfig(env, argv = {}) {
  const isProduction = argv.mode === 'production';

  const stats = {
    modules: false,
    children: false,
    chunks: false,
  };

  const development = {
    plugins: [new webpack.HotModuleReplacementPlugin()],
    devServer: {
      host: '0.0.0.0',
      watchContentBase: true,
      stats,
      publicPath: '/',
      historyApiFallback: {
        disableDotRule: true,
      },
      hot: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
  };

  const production = {
    optimization: {
      minimize: true,
      // minimizer: [
      //   new UglifyJsPlugin({
      //     sourceMap: true,
      //     uglifyOptions: {
      //       compress: {
      //         drop_console: true,
      //       },
      //     },
      //   }),
      // ],
      splitChunks: {
        chunks: 'all',
      },
      noEmitOnErrors: true,
    },
    module: {
      rules: [
        {
          test: /\.s?css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            {
              loader: 'resolve-url-loader',
              options: {
                keepQuery: true,
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new OptimizeCSSAssetsPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[hash].[name].css',
      }),
    ],
    performance: { hints: false },
    devtool: false,
  };


  return merge(
    {
      entry: {
        main: appPath('src/index.js'),
      },
      output: {
        filename: '[name].js?v=[hash]',
        chunkFilename: '[name].chunk.js?v=[hash]',
        publicPath: '/',
        globalObject: 'this',
      },
      resolve: {
        alias: { '@': appPath('src') },
        extensions: ['.js', '.jsx', '.scss'],
        modules: [appPath('node_modules')],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': JSON.stringify({
            ...appEnv,
            isProduction,
            NODE_ENV: argv.mode,
            DEBUG: !isProduction,
          }),
        }),
        // new PrepackWebpackPlugin({
        //   test: /^(?!.*\.worker).*\.jsx?$/i,
        // }),
        new HtmlWebpackPlugin({
          chunks: ['main', 'vendors~main'],
          minify: isProduction
            ? {
              collapseWhitespace: true,
              preserveLineBreaks: true,
              removeComments: true,
            }
            : null,
          filename: 'index.html',
          template: appPath('src/templates/index.html'),
          favicon: appPath('src/assets/favicon.png'),

        }),
        // new PreloadWebpackPlugin(),
      ],
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: [
              {
                loader: 'babel-loader',
              },
            ],
          },
          {
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader',
                options: { minimize: isProduction },
              },
            ],
          },
          {
            test: /\.(raw)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: 'raw-loader',
          },
          {
            test: /\.(png|gif|jpe?g|svg|webp)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              'image-webpack-loader',
              {
                loader: 'file-loader',
                options: {
                  name: '[hash].[ext]',
                  outputPath: 'images/',
                  verbose: false,
                },
              },
            ],
          },
          {
            test: /\.(eot|tiff|woff2|woff|ttf|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[hash].[ext]',
                  outputPath: 'fonts/',
                  verbose: false,
                },
              },
            ],
          },
          {
            test: /\.md$/,
            use: [
              {
                loader: 'remark-loader',
                options: {
                  plugins: [],
                },
              },
            ],
          },
        ],
      },
      stats,
      devtool: 'source-map',
    },
    isProduction ? production : development,
  );
};
