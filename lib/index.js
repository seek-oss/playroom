const start = require('./start');
const build = require('./build');
const provideDefaultConfig = require('./provideDefaultConfig');

module.exports = (userConfig) => {
  const config = provideDefaultConfig(userConfig);

  return {
    start: (callback) => start(config, callback),
    build: (callback) => build(config, callback),
  };
};
