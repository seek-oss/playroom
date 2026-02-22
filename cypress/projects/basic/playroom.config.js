module.exports = {
  components: './components',
  frameComponent: './FrameComponent',
  scope: './useScope',
  snippets: './snippets',
  frameSettings: [
    {
      id: 'darkMode',
      label: 'Dark Mode',
      defaultValue: false,
    },
    {
      id: 'compactMode',
      label: 'Compact Mode',
      defaultValue: false,
    },
  ],
  outputPath: './dist',
  openBrowser: false,
  port: 9000,
  storageKey: 'playroom-example-basic',
};
