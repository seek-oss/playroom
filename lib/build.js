const webpack = require('webpack');
const vite = require('vite');
const makeWebpackConfig = require('./makeWebpackConfig');
const makeViteConfig = require('./makeViteConfig');
const noop = () => {};

/**
 *
 * @param {import('../src/internalTypes').InternalPlayroomConfig} config
 * @param {(...args: any[]) => void} callback
 */
module.exports = async (config, callback = noop) => {
  if (config.bundler === 'webpack') {
    const webpackConfig = await makeWebpackConfig(config, { production: true });
    webpack(webpackConfig, (err, stats) => {
      // https://webpack.js.org/api/node/#error-handling
      if (err) {
        const errorMessage = [err.stack || err, err.details]
          .filter(Boolean)
          .join('/n/n');
        return callback(errorMessage);
      }

      if (stats.hasErrors()) {
        const info = stats.toJson();
        return callback(info.errors.map((error) => error.message).join('\n\n'));
      }

      return callback();
    });
  } else if (config.bundler === 'vite') {
    const viteConfig = await makeViteConfig(
      { ...config, baseUrl: '' },
      {
        production: true,
      }
    );
    try {
      await vite.build(viteConfig);
      return callback();
    } catch (e) {
      console.error('Error building playroom with vite');
      console.error(e);
      return callback(e.toString());
    }
  } else {
    throw new Error(
      `Unknown bundler "${config.bundler}. Add the 'bundler' field with a value of 'webpack' or 'vite' to your playroom config."`
    );
  }
};
