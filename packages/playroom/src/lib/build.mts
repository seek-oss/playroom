import webpack from 'webpack';

import makeWebpackConfig from './makeWebpackConfig.mts';
import type { ResolvedPlayroomConfig } from './provideDefaultConfig.mts';

const noop = () => {};

export default async (
  config: ResolvedPlayroomConfig,
  callback: (error?: string) => void = noop,
) => {
  const webpackConfig = await makeWebpackConfig(config, { production: true });

  webpack(webpackConfig, (err, stats) => {
    // https://webpack.js.org/api/node/#error-handling
    if (err) {
      const details = 'details' in err ? err.details : undefined;
      const errorMessage = [err.stack || err, details]
        .filter(Boolean)
        .join('/n/n');
      return callback(errorMessage);
    }

    if (stats?.hasErrors()) {
      const info = stats.toJson();
      return callback(
        (info.errors ?? []).map((error) => error.message).join('\n\n'),
      );
    }

    return callback();
  });
};
