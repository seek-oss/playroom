const start = require('./start');
const build = require('./build');

const provideDefaults = config => ({
  port: 9000,
  openBrowser: true,
  ...config
});

module.exports = config => {
  return {
    start: callback => start(provideDefaults(config), callback),
    build: callback => build(provideDefaults(config), callback)
  };
};
