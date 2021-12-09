const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const makeWebpackConfig = require('./makeWebpackConfig');
const portfinder = require('portfinder');

module.exports = async (config, callback) => {
  const webpackConfig = await makeWebpackConfig(
    { ...config, baseUrl: '' },
    {
      production: false,
      infrastructureLogging: {
        level: 'none',
      },
      stats: {
        errorDetails: true,
      },
    }
  );
  const { port, openBrowser } = config;

  portfinder.getPort({ port }, function (portErr, availablePort) {
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
