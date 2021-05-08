module.exports = {
  components: './components',
  componentHints: () => {
    return {
      'wc-bar': {
        attrs: {
          name: null,
        },
      },
      'wc-foo': {
        attrs: {
          name: null,
        },
      },
    };
  },
  scope: './useScope',
  snippets: './snippets',
  outputPath: './dist',
  openBrowser: false,
  storageKey: 'playroom-example-wc',
};
