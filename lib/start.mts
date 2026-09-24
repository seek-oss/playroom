import portfinder from 'portfinder';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import makeWebpackConfig from './makeWebpackConfig.mts';
import type { ResolvedPlayroomConfig } from './provideDefaultConfig.mts';

export default async (
  config: ResolvedPlayroomConfig,
  callback?: () => void,
) => {
  const { port, openBrowser } = config;

  let availablePort;
  try {
    availablePort = await portfinder.getPortPromise({
      port,
    });
  } catch (portErr) {
    console.error('portErr: ', portErr);
    return;
  }

  const resolvedBundler =
    config.bundler === 'vite' || Boolean(config.viteConfig)
      ? 'vite'
      : 'webpack';

  if (resolvedBundler === 'webpack') {
    const webpackConfig = await makeWebpackConfig(
      { ...config, baseUrl: '' },
      { production: false },
    );

    const webpackDevServerConfig = {
      hot: true,
      port: availablePort,
      open: openBrowser,
      devMiddleware: {
        stats: false,
      },
      client: {
        overlay: false,
      },
      compress: true,
      static: {
        watch: { ignored: /node_modules/ },
      },
      // Added to prevent Webpack HMR from breaking when iframeSandbox option is used
      // See: https://github.com/webpack/webpack-dev-server/issues/1604
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };

    const compiler = webpack(webpackConfig);
    const devServer = new WebpackDevServer(webpackDevServerConfig, compiler);

    devServer.startCallback(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  } else if (resolvedBundler === 'vite') {
    const { createServer } = await import('vite');
    const makeViteConfig = (await import('./makeViteConfig.mts')).default;
    const viteConfig = await makeViteConfig(
      { ...config, port: availablePort, baseUrl: '' },
      {
        production: false,
      },
    );

    const server = await createServer(viteConfig);
    await server.listen();
    server.printUrls();
  }
};
