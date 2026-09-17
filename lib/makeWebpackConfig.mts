import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import FriendlyErrorsWebpackPlugin from '@soda/friendly-errors-webpack-plugin';
import { cssFileFilter } from '@vanilla-extract/integration';
import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack, { type Configuration } from 'webpack';
import { mergeWithRules } from 'webpack-merge';

import getStaticTypes from './getStaticTypes.mts';
import makeDefaultWebpackConfig from './makeDefaultWebpackConfig.mts';
import type { ResolvedPlayroomConfig } from './provideDefaultConfig.mts';

const require = createRequire(import.meta.url);
const playroomPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const includePaths = [
  path.resolve(playroomPath, 'lib'),
  path.resolve(playroomPath, 'src'),
  path.resolve(playroomPath, 'utils'),
];

const isPlayroomRepo = !playroomPath.includes('node_modules');

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
      index: [path.join(playroomPath, 'src/entries/index.tsx')],
      frame: [path.join(playroomPath, 'src/entries/frame.tsx')],
      preview: [path.join(playroomPath, 'src/entries/preview.tsx')],
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
          : path.join(playroomPath, 'lib/defaultModules/snippets.ts'),
        __PLAYROOM_ALIAS__THEMES__: playroomConfig.themes
          ? relativeResolve(playroomConfig.themes)
          : path.join(playroomPath, 'lib/defaultModules/themes.ts'),
        __PLAYROOM_ALIAS__FRAME_COMPONENT__: playroomConfig.frameComponent
          ? relativeResolve(playroomConfig.frameComponent)
          : path.join(playroomPath, 'lib/defaultModules/FrameComponent.tsx'),
        __PLAYROOM_ALIAS__USE_SCOPE__: playroomConfig.scope
          ? relativeResolve(playroomConfig.scope)
          : path.join(playroomPath, 'lib/defaultModules/useScope.ts'),
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
          test: /(\.vanilla)?\.css$/i,
          issuer: isPlayroomRepo ? undefined : /node_modules[\\/]playroom/,
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
        favicon: path.join(playroomPath, 'images/favicon.png'),
        base: playroomConfig.baseUrl,
        template: path.join(playroomPath, 'src/entries/template.html'),
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
        favicon: path.join(playroomPath, 'images/favicon.png'),
        publicPath: '../',
        template: path.join(playroomPath, 'src/entries/template.html'),
      }),
      new VanillaExtractPlugin({
        test: (filePath: string) =>
          // Only apply VanillaExtract plugin to playroom and its dependency's Vanilla Extract modules
          cssFileFilter.test(filePath) &&
          includePaths.some((includePath) => filePath.startsWith(includePath)),
      }),
      new MiniCssExtractPlugin({ ignoreOrder: true }),
      ...(options.production ? [] : [new FriendlyErrorsWebpackPlugin()]),
    ],
    devtool: !options.production && 'eval-source-map',
  };

  const theirConfig = playroomConfig.webpackConfig
    ? await playroomConfig.webpackConfig()
    : makeDefaultWebpackConfig(playroomConfig);

  return mergeWithRules({
    module: {
      rules: {
        test: 'match',
        use: 'replace',
      },
    },
  })(ourConfig, theirConfig as Configuration);
};
