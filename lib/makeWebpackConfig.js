const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const getStaticTypes = require('./getStaticTypes');
const makeDefaultWebpackConfig = require('./makeDefaultWebpackConfig');

const playroomPath = path.resolve(__dirname, '..');
const includePaths = [
  path.resolve(playroomPath, 'lib'),
  path.resolve(playroomPath, 'src')
];

module.exports = async (playroomConfig, options) => {
  const relativeResolve = requirePath =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const staticTypes = await getStaticTypes(playroomConfig);

  const devServerEntries = options.production
    ? []
    : [
        `webpack-dev-server/client?http://localhost:${playroomConfig.port}`,
        'webpack/hot/dev-server'
      ];

  const postcssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      plugins: () => [require('autoprefixer')()]
    }
  };

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      modules: {
        mode: 'local',
        localIdentName: '[name]__[local]--[hash:base64:5]'
      }
    }
  };

  const ourConfig = {
    mode: options.production ? 'production' : 'development',
    entry: {
      index: [...devServerEntries, require.resolve('../src/index.js')],
      frame: [...devServerEntries, require.resolve('../src/frame.js')]
    },
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(playroomConfig.cwd, playroomConfig.outputPath),
      publicPath: ''
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
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
          : require.resolve('./defaultModules/FrameComponent')
      }
    },
    module: {
      // This option fixes https://github.com/prettier/prettier/issues/4959
      // Once this issue is fixed, we can remove this line:
      exprContextCritical: false,
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: includePaths,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react'),
                require.resolve('@babel/preset-typescript')
              ],
              plugins: [
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-proposal-optional-chaining'),
                require.resolve(
                  '@babel/plugin-proposal-nullish-coalescing-operator'
                )
              ]
            }
          }
        },
        {
          test: /\.js$/,
          include: includePaths,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react')
              ],
              plugins: [
                require.resolve('@babel/plugin-proposal-class-properties')
              ]
            }
          }
        },
        {
          test: /\.(scss|sass)$/,
          include: includePaths,
          use: [
            require.resolve('style-loader'),
            cssLoader,
            postcssLoader,
            require.resolve('resolve-url-loader'),
            require.resolve('sass-loader')
          ]
        },
        {
          test: /\.less$/,
          include: includePaths,
          use: [
            require.resolve('style-loader'),
            cssLoader,
            postcssLoader,
            require.resolve('less-loader')
          ]
        },
        {
          test: /\.css$/,
          include: path.dirname(require.resolve('codemirror/package.json')),
          use: [require.resolve('style-loader'), require.resolve('css-loader')]
        }
      ]
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      },
      runtimeChunk: {
        name: 'runtime'
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
        __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes)
      }),
      new HtmlWebpackPlugin({
        title: playroomConfig.title
          ? `Playroom | ${playroomConfig.title}`
          : 'Playroom',
        chunksSortMode: 'none',
        chunks: ['index'],
        filename: 'index.html'
      }),
      new HtmlWebpackPlugin({
        title: 'Playroom Frame',
        chunksSortMode: 'none',
        chunks: ['frame'],
        filename: 'frame.html'
      }),
      ...(options.production
        ? []
        : [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsWebpackPlugin()
          ])
    ],
    devtool: options.production ? 'none' : 'eval-source-map'
  };

  const theirConfig = playroomConfig.webpackConfig
    ? playroomConfig.webpackConfig()
    : makeDefaultWebpackConfig(playroomConfig);

  return merge(ourConfig, theirConfig);
};
