const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const { mergeWithRules } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const getStaticTypes = require('./getStaticTypes');
const makeDefaultWebpackConfig = require('./makeDefaultWebpackConfig');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const playroomPath = path.resolve(__dirname, '..');
const includePaths = [
  path.resolve(playroomPath, 'lib'),
  path.resolve(playroomPath, 'src'),
];

module.exports = async (playroomConfig, options) => {
  const relativeResolve = (requirePath) =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  let isLegacyReact = true;

  try {
    // eslint-disable-next-line no-sync
    const pkgContents = fs.readFileSync(
      relativeResolve('react-dom/package.json'),
      {
        encoding: 'utf-8',
      }
    );
    const { version } = JSON.parse(pkgContents);
    isLegacyReact = !(version.startsWith('18') || version.startsWith('0.0.0'));
  } catch (e) {
    throw new Error('Unable to read `react-dom` package json');
  }

  const staticTypes = await getStaticTypes(playroomConfig);

  const ourConfig = {
    mode: options.production ? 'production' : 'development',
    entry: {
      index: [require.resolve('../src/index.js')],
      frame: [require.resolve('../src/frame.js')],
      preview: [require.resolve('../src/preview.js')],
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
          : require.resolve('./defaultModules/snippets'),
        __PLAYROOM_ALIAS__THEMES__: playroomConfig.themes
          ? relativeResolve(playroomConfig.themes)
          : require.resolve('./defaultModules/themes'),
        __PLAYROOM_ALIAS__FRAME_COMPONENT__: playroomConfig.frameComponent
          ? relativeResolve(playroomConfig.frameComponent)
          : require.resolve('./defaultModules/FrameComponent'),
        __PLAYROOM_ALIAS__USE_SCOPE__: playroomConfig.scope
          ? relativeResolve(playroomConfig.scope)
          : require.resolve('./defaultModules/useScope'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
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
                  [
                    require.resolve('@babel/preset-react'),
                    { runtime: 'automatic' },
                  ],
                  require.resolve('@babel/preset-typescript'),
                ],
              },
            },
          ],
        },
        {
          test: /\.js$/,
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
                  [
                    require.resolve('@babel/preset-react'),
                    { runtime: 'automatic' },
                  ],
                ],
              },
            },
          ],
        },
        {
          test: /\.vanilla\.css$/i,
          include: playroomPath.includes('node_modules')
            ? /node_modules\/playroom/
            : undefined,
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
          test: /\.css$/,
          include: path.dirname(require.resolve('codemirror/package.json')),
          use: [MiniCssExtractPlugin.loader, require.resolve('css-loader')],
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
        favicon: path.join(__dirname, '../images/favicon.png'),
        base: playroomConfig.baseUrl,
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
        publicPath: '../',
      }),
      new VanillaExtractPlugin({
        test: (filePath) => {
          // Only apply VanillaExtract plugin to playroom's source `.css.ts` files
          return (
            /\.css\.ts$/i.test(filePath) &&
            includePaths.some((includePath) => filePath.startsWith(includePath))
          );
        },
      }),
      new MiniCssExtractPlugin({ ignoreOrder: true }),
      ...(options.production ? [] : [new FriendlyErrorsWebpackPlugin()]),
      // If using a version of React earlier than 18, ignore the
      // react-dom/client import. This hack can be removed when
      // support for older versions of React is removed.
      ...(isLegacyReact
        ? [
            new webpack.IgnorePlugin({
              resourceRegExp: /react-dom\/client$/,
            }),
          ]
        : []),
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
