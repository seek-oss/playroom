import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack, { type Configuration } from 'webpack';
import { merge, mergeWithRules } from 'webpack-merge';

// Only used for playroom development. Resolves to a stub during packaging.
import webpackDevConfig from '#webpack/devConfig';

import getStaticTypes from './getStaticTypes.mts';
import makeDefaultWebpackConfig from './makeDefaultWebpackConfig.mts';
import type { ResolvedPlayroomConfig } from './provideDefaultConfig.mts';

const require = createRequire(import.meta.url);
const playroomPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const includePaths = [
  path.resolve(playroomPath, 'src'),
  path.resolve(playroomPath, 'lib'),
  path.resolve(playroomPath, 'dist'),
  path.resolve(playroomPath, 'utils'),
];

const resolvePlayroomModule = (specifier: string) =>
  fileURLToPath(import.meta.resolve(specifier));

const faviconPath = resolvePlayroomModule('#static/favicon.png');
const templatePath = resolvePlayroomModule('#static/template.html');

interface MakeWebpackConfigOptions {
  production?: boolean;
}

export default async (
  playroomConfig: ResolvedPlayroomConfig,
  options: MakeWebpackConfigOptions,
): Promise<Configuration> => {
  const relativeResolve = (requirePath: string) =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const staticTypes = await getStaticTypes(playroomConfig);

  const ourConfig: Configuration = {
    mode: options.production ? 'production' : 'development',
    entry: {
      index: [resolvePlayroomModule('#entries/index')],
      frame: [resolvePlayroomModule('#entries/frame')],
      preview: [resolvePlayroomModule('#entries/preview')],
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
          playroomConfig.components,
        ),
        __PLAYROOM_ALIAS__SNIPPETS__: playroomConfig.snippets
          ? relativeResolve(playroomConfig.snippets)
          : resolvePlayroomModule('#defaultModules/snippets'),
        __PLAYROOM_ALIAS__THEMES__: playroomConfig.themes
          ? relativeResolve(playroomConfig.themes)
          : resolvePlayroomModule('#defaultModules/themes'),
        __PLAYROOM_ALIAS__FRAME_COMPONENT__: playroomConfig.frameComponent
          ? relativeResolve(playroomConfig.frameComponent)
          : resolvePlayroomModule('#defaultModules/FrameComponent'),
        __PLAYROOM_ALIAS__USE_SCOPE__: playroomConfig.scope
          ? relativeResolve(playroomConfig.scope)
          : resolvePlayroomModule('#defaultModules/useScope'),
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
          include: [
            ...includePaths,
            path.dirname(require.resolve('codemirror/package.json')),
          ],
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
  })(ourConfig, theirConfig as Configuration);

  return merge(mergedConfig, webpackDevConfig);
};
