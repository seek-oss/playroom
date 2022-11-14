const start = require('./start');
const build = require('./build');
const viteStart = require('./viteStart');
const viteBuild = require('./viteBuild');
const provideDefaultConfig = require('./provideDefaultConfig');

module.exports = (userConfig) => {
  const config = provideDefaultConfig(userConfig);

  return {
    start: (callback) => start(config, callback),
    build: (callback) => build(config, callback),
    ['vite-start']: () => viteStart(config),
    ['vite-build']: () => viteBuild(config),
  };
};
