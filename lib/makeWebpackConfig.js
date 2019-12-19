const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const extractTypeInformation = require('./extractTypeInformation');
const makeDefaultWebpackConfig = require('./makeDefaultWebpackConfig');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const playroomPath = path.resolve(__dirname, '..');
const includePaths = [
  path.resolve(playroomPath, 'lib'),
  path.resolve(playroomPath, 'src')
];

module.exports = async (playroomConfig, options) => {
  const relativeResolve = requirePath =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const typeInfo = await extractTypeInformation(playroomConfig);
  // console.log(typeInfo);

  // process.exit();

  const devServerEntries = options.production
    ? []
    : [
        `webpack-dev-server/client?http://localhost:${playroomConfig.port}`,
        'webpack/hot/dev-server'
      ];

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
          test: /\.less$/,
          include: includePaths,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  mode: 'local',
                  localIdentName: '[name]__[local]--[hash:base64:5]'
                }
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                plugins: () => [require('autoprefixer')()]
              }
            },
            require.resolve('less-loader')
          ]
        },
        {
          test: /\.css$/,
          include: path.dirname(require.resolve('monaco-editor/package.json')),
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
      new MonacoWebpackPlugin({
        languages: ['typescript']
      }),
      new webpack.DefinePlugin({
        __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
        __PLAYROOM_GLOBAL__TYPE_INFO__: JSON.stringify(typeInfo)
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
