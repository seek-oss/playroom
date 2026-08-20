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
  widths: {
    sm: 320,
    md: 375,
    lg: 768,
    xl: 1024,
  },
  outputPath: './dist',
  openBrowser: false,
  port: 9000,
  storageKey: 'playroom-example-basic',
};
