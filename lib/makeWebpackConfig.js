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

  const ourConfig = {
    mode: options.production ? 'production' : 'development',
    entry: require.resolve('../src/index.js'),
    output: {
      path: path.resolve(playroomConfig.cwd, playroomConfig.outputPath),
      publicPath: ''
    },
    resolve: {
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
                require.resolve('babel-plugin-transform-class-properties')
              ]
            }
          }
        },
        {
          test: /\.less$/,
          include: includePaths,
          use: [
            {
              loader: require.resolve('style-loader'),
              options: {
                insertAt: 'top'
              }
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: true,
                localIdentName: '[name]__[local]--[hash:base64:5]'
              }
            },
            require.resolve('less-loader')
          ]
        },
        {
          test: /\.css$/,
          include: path.dirname(require.resolve('codemirror/package.json')),
          use: [
            {
              loader: require.resolve('style-loader'),
              options: {
                insertAt: 'top'
              }
            },
            require.resolve('css-loader')
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
        __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes)
      }),
      new HtmlWebpackPlugin({
        title: playroomConfig.title
          ? `Playroom | ${playroomConfig.title}`
          : 'Playroom'
      }),
      ...(options.production ? [] : [new FriendlyErrorsWebpackPlugin()])
    ],
    devtool: options.production ? 'none' : 'eval-source-map'
  };

  const theirConfig = playroomConfig.webpackConfig
    ? playroomConfig.webpackConfig()
    : makeDefaultWebpackConfig(playroomConfig);

  return merge(ourConfig, theirConfig);
};
