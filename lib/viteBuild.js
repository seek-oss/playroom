const { build } = require('vite');

const makeViteConfig = require('./makeViteConfig');

module.exports = async (playroomConfig) => {
  const viteConfig = await makeViteConfig(playroomConfig, { command: 'build' });

  await build(viteConfig);
};
