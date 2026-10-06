import { createRequire } from 'node:module';
import path from 'node:path';

import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { Configuration } from 'webpack';

import { playroomPath } from './playroomPath.ts';

const require = createRequire(import.meta.url);
const srcPath = path.resolve(playroomPath, 'src');

const webpackDevConfig: Configuration = {
  resolve: {
    conditionNames: ['...', '@playroom/dev'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [srcPath],
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
        test: /\.vanilla\.css$/i,
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
    ],
  },
  plugins: [new VanillaExtractPlugin()],
};

export default webpackDevConfig;
