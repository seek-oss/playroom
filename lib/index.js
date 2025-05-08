const provideDefaultConfig = require('./provideDefaultConfig');

module.exports = (userConfig) => {
  const config = provideDefaultConfig(userConfig);

  return {
    start: (callback) => {
      const start = require('./start');
      start(config, callback);
    },
    build: (callback) => {
      const build = require('./build');
      build(config, callback);
    },
  };
};
