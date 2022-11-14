const { createServer } = require('vite');

const makeViteConfig = require('./makeViteConfig');

module.exports = async (playroomConfig) => {
  const viteConfig = await makeViteConfig(
    { ...playroomConfig, baseUrl: '' },
    { command: 'serve' }
  );

  const server = await createServer(viteConfig);
  await server.listen();
  server.printUrls();
};
