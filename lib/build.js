const webpack = require('webpack');
const makeWebpackConfig = require('./makeWebpackConfig');
const noop = () => {};

module.exports = (config, callback = noop) => {
  const webpackConfig = makeWebpackConfig(config, { production: true });

  webpack(webpackConfig, (err, stats) => {
    // https://webpack.js.org/api/node/#error-handling
    if (err) {
      const errorMessage = [err.stack || err, err.details]
        .filter(Boolean)
        .join('/n/n');
      return callback(errorMessage);
    }

    const info = stats.toJson();
    if (stats.hasErrors()) {
      return callback(info.errors.join('\n\n'));
    }

    return callback();
  });
};
