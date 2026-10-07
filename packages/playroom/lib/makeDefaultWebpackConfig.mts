import { createRequire } from 'node:module';

import type { Configuration } from 'webpack';

import type { PlayroomConfig } from '../utils/index.ts';

const require = createRequire(import.meta.url);

export default (playroomConfig: PlayroomConfig): Configuration => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: playroomConfig.cwd,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                [
                  require.resolve('@babel/preset-react'),
                  { runtime: 'automatic' },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
});
