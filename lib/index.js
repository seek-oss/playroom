const start = require('./start');
const build = require('./build');

module.exports = config => {
  return {
    start: callback => start(config, callback),
    build: callback => build(config, callback)
  };
};
