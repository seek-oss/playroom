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

  devServer.listen(config.port || 9000, 'localhost', (...args) => {
    const [err] = args;

    if (!err) {
      opn('http://localhost:9000');
    }

    if (typeof callback === 'function') {
      callback(...args);
    }
  });
};
