import webpack from 'webpack';

import makeWebpackConfig from './makeWebpackConfig.mts';
import type { ResolvedPlayroomConfig } from './provideDefaultConfig.mts';

const noop = () => {};

export default async (
  config: ResolvedPlayroomConfig,
  callback: (error?: string) => void = noop,
) => {
  const resolvedBundler =
    config.bundler === 'vite' || Boolean(config.viteConfig)
      ? 'vite'
      : 'webpack';

  if (resolvedBundler === 'webpack') {
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
  } else if (resolvedBundler === 'vite') {
    const { build } = await import('vite');
    const makeViteConfig = (await import('./makeViteConfig.mts')).default;
    const viteConfig = await makeViteConfig(
      { ...config, baseUrl: '' },
      {
        production: true,
      },
    );
    try {
      await build(viteConfig);
      return callback();
    } catch (e: any) {
      console.error('Error building playroom with vite');
      console.error(e);
      return callback(e.toString());
    }
  }
};
