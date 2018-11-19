const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opn = require('opn');
const makeWebpackConfig = require('./makeWebpackConfig');

module.exports = (config, callback) => {
  const webpackConfig = makeWebpackConfig(config, { production: false });
  const webpackDevServerConfig = {
    stats: {},
    noInfo: true,
    quiet: true,
    clientLogLevel: 'none',
    compress: true,
    inline: true,
    watchOptions: { ignored: /node_modules/ }
  };

  const compiler = webpack(webpackConfig);
  const devServer = new WebpackDevServer(compiler, webpackDevServerConfig);
  const { port = 9000, openBrowser = true } = config;

  devServer.listen(port, 'localhost', (...args) => {
    const [err] = args;

    if (!err && openBrowser) {
      opn(`http://localhost:${port}`);
    }

    if (typeof callback === 'function') {
      callback(...args);
    }
  });
};
