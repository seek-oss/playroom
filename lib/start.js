const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const open = require('open');
const makeWebpackConfig = require('./makeWebpackConfig');
const portfinder = require('portfinder');

module.exports = async (config, callback) => {
  const webpackConfig = await makeWebpackConfig(
    { ...config, baseUrl: '' },
    {
      production: false,
      infrastructureLogging: {
        level: 'none'
      },
      stats: {
        errorDetails: true
      }
    }
  );
  const webpackDevServerConfig = {
    // hot: true,
    // stats: {},
    // noInfo: true,
    // quiet: true,
    // clientLogLevel: 'none',
    compress: true,
    // inline: true,
    // watchOptions: { ignored: /node_modules/ },
    // Added to prevent Webpack HMR from breaking when iframeSandbox option is used
    // See: https://github.com/webpack/webpack-dev-server/issues/1604
    firewall: false,
  };

  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, webpackDevServerConfig);
  const { port, openBrowser } = config;

  portfinder.getPort({ port }, function (portErr, availablePort) {
    if (portErr) {
      console.error('portErr: ', portErr);
      return;
    }
    devServer.listen(availablePort, '0.0.0.0', (...args) => {
      const [err] = args;

      if (!err && openBrowser) {
        open(`http://localhost:${availablePort}`);
      }

      if (typeof callback === 'function') {
        callback(...args);
      }
    });
  });
};
