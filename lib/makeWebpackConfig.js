const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const playroomPath = path.resolve(__dirname, '..');
const localNodeModulesPath = path.resolve(playroomPath, 'node_modules');

module.exports = (playroomConfig, options) => {
  const relativeResolve = requirePath =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const ourConfig = {
    mode: options.production ? 'production' : 'development',
    entry: require.resolve('../src/index.js'),
    output: {
      path: path.resolve(playroomConfig.cwd, playroomConfig.outputPath),
      publicPath: '/'
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
      rules: [
        {
          test: /\.js$/,
          include: [playroomPath],
          exclude: localNodeModulesPath,
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
          include: [playroomPath],
          exclude: localNodeModulesPath,
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
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig)
      }),
      new HtmlWebpackPlugin({
        title: playroomConfig.title
          ? `Playroom | ${playroomConfig.title}`
          : 'Playroom'
      })
    ],
    devtool: options.production ? 'none' : 'eval-source-map'
  };

  const theirConfig = playroomConfig.webpackConfig
    ? playroomConfig.webpackConfig()
    : {};

  return merge(ourConfig, theirConfig);
};
