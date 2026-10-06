import portfinder from 'portfinder';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import makeWebpackConfig from './makeWebpackConfig.mts';
import type { ResolvedPlayroomConfig } from './provideDefaultConfig.mts';

export default async (
  config: ResolvedPlayroomConfig,
  callback?: () => void,
) => {
  const webpackConfig = await makeWebpackConfig(
    { ...config, baseUrl: '' },
    { production: false },
  );
  const { port, openBrowser } = config;

  portfinder.getPort({ port }, (portErr, availablePort) => {
    if (portErr) {
      console.error('portErr: ', portErr);
      return;
    }
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
  });
};
