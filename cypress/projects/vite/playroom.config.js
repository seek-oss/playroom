/**
 * @type {import('../../../src/types').PlayroomConfig}
 */
module.exports = {
  components: './components.jsx',
  snippets: './snippets',
  themes: './themes',
  frameComponent: './FrameComponent.jsx',
  outputPath: './dist',
  openBrowser: false,
  paramType: 'search',
  port: 9001,
  storageKey: 'playroom-example-vite',
  bundler: 'vite',
};
