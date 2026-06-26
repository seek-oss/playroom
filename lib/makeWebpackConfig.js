const path = require('path');

const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const { mergeWithRules } = require('webpack-merge');

const getStaticTypes = require('./getStaticTypes');
const makeDefaultWebpackConfig = require('./makeDefaultWebpackConfig');

const playroomPath = path.resolve(__dirname, '..');
const includePaths = [
  path.resolve(playroomPath, 'lib'),
  path.resolve(playroomPath, 'dist'),
  path.resolve(playroomPath, 'utils'),
];

const isPlayroomRepo = !playroomPath.includes('node_modules');

const faviconPath = path.resolve(playroomPath, 'dist/static/favicon.png');
const templatePath = path.resolve(playroomPath, 'dist/static/template.html');

module.exports = async (playroomConfig, options) => {
  const relativeResolve = (requirePath) =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const staticTypes = await getStaticTypes(playroomConfig);

  const ourConfig = {
    mode: options.production ? 'production' : 'development',
    entry: {
      index: [require.resolve('#entries/index')],
      frame: [require.resolve('#entries/frame')],
      preview: [require.resolve('#entries/preview')],
    },
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(playroomConfig.cwd, playroomConfig.outputPath),
      publicPath: playroomConfig.baseUrl,
    },
    resolve: {
      fallback: {
        path: false,
        fs: false,
      },
      extensions: ['.mjs', '.tsx', '.ts', '.jsx', '.js', '.json'],
      alias: {
        __PLAYROOM_ALIAS__COMPONENTS__: relativeResolve(
          playroomConfig.components
        ),
        __PLAYROOM_ALIAS__SNIPPETS__: playroomConfig.snippets
          ? relativeResolve(playroomConfig.snippets)
          : require.resolve('#defaultModules/snippets'),
        __PLAYROOM_ALIAS__THEMES__: playroomConfig.themes
          ? relativeResolve(playroomConfig.themes)
          : require.resolve('#defaultModules/themes'),
        __PLAYROOM_ALIAS__FRAME_COMPONENT__: playroomConfig.frameComponent
          ? relativeResolve(playroomConfig.frameComponent)
          : require.resolve('#defaultModules/FrameComponent'),
        __PLAYROOM_ALIAS__USE_SCOPE__: playroomConfig.scope
          ? relativeResolve(playroomConfig.scope)
          : require.resolve('#defaultModules/useScope'),
      },
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          include: includePaths,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  [
                    require.resolve('@babel/preset-env'),
                    { shippedProposals: true },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          issuer: isPlayroomRepo ? undefined : /node_modules\/playroom/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                url: false,
              },
            },
          ],
        },
        {
          test: /\.png$/i,
          type: 'asset/resource',
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
      runtimeChunk: {
        name: 'runtime',
      },
    },
    plugins: [
      new webpack.DefinePlugin({
        __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
        __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes),
      }),
      new HtmlWebpackPlugin({
        title: playroomConfig.title
          ? `Playroom | ${playroomConfig.title}`
          : 'Playroom',
        chunksSortMode: 'none',
        chunks: ['index'],
        filename: 'index.html',
        favicon: faviconPath,
        base: playroomConfig.baseUrl,
        template: templatePath,
      }),
      new HtmlWebpackPlugin({
        title: 'Playroom Frame',
        chunksSortMode: 'none',
        chunks: ['frame'],
        filename: 'frame.html',
      }),
      new HtmlWebpackPlugin({
        title: 'Playroom Preview',
        chunksSortMode: 'none',
        chunks: ['preview'],
        filename: 'preview/index.html',
        favicon: faviconPath,
        publicPath: '../',
        template: templatePath,
      }),
      new MiniCssExtractPlugin({ ignoreOrder: true }),
      ...(options.production ? [] : [new FriendlyErrorsWebpackPlugin()]),
    ],
    devtool: !options.production && 'eval-source-map',
  };

  const theirConfig = playroomConfig.webpackConfig
    ? await playroomConfig.webpackConfig()
    : makeDefaultWebpackConfig(playroomConfig);

  const mergedConfig = mergeWithRules({
    module: {
      rules: {
        test: 'match',
        use: 'replace',
      },
    },
  })(ourConfig, theirConfig);

  return mergedConfig;
};
