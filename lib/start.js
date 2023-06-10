const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const makeWebpackConfig = require('./makeWebpackConfig');
const portfinder = require('portfinder');
const vite = require('vite');
const makeViteConfig = require('./makeViteConfig');

module.exports = async (config, callback) => {
  const { port: desiredPort, openBrowser } = config;

  let availablePort;
  try {
    availablePort = await portfinder.getPortPromise({
      port: desiredPort,
    });
  } catch (portErr) {
    console.error('portErr: ', portErr);
    return;
  }

  if (config.bundler === 'webpack') {
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

    console.log(config.cwd);
    console.log(webpackConfig.module.rules);
    const compiler = webpack(webpackConfig);
    const devServer = new WebpackDevServer(webpackDevServerConfig, compiler);

    devServer.startCallback(() => {
      if (typeof callback === 'function') {
        callback();
      }
    });
  } else if (config.bundler === 'vite') {
    const viteConfig = await makeViteConfig(
      { ...config, port: availablePort, baseUrl: '' },
      {
        production: false,
      }
    );

    const server = await vite.createServer(viteConfig);
    await server.listen();
    server.printUrls();
  } else {
    throw new Error(
      `Unknown bundler "${config.bundler}. Add the 'bundler' field with a value of 'webpack' or 'vite' to your playroom config."`
    );
  }
};
