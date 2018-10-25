const webpack = require('webpack');
const makeWebpackConfig = require('./makeWebpackConfig');

module.exports = (config, callback) => {
  const webpackConfig = makeWebpackConfig(config, { production: true });

  webpack(webpackConfig, (...args) => {
    if (typeof callback === 'function') {
      callback(...args);
    }
  });
};
