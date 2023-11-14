---
'playroom': minor
---

Adds support for vite. This allows user to configure a bundler, by specifying a `bundler` option in their Playroom config.

This new option is required, and can have values of `'vite' | 'webpack'`. Additionally to this, we also added a `viteConfig` config field, which can be used similarly to `webpackConfig`, with this parameter you can specify a callback and return a vite configuration object.

```js
// playroom.config.js
const svgr = require("vite-plugin-svgr");

/**
 * @type {import('../../../src/types').PlayroomConfig}
 */
module.exports = {
  components: './components.ts',
  snippets: './snippets.ts',
  outputPath: './dist',
  scope: './useScope.ts',
  themes: './themes.ts',
  frameComponent: './FrameComponent.tsx',
  outputPath: './dist',
  openBrowser: false,
  bundler: 'vite',
  viteConfig: () => ({
    plugins: [svgr()]
  })
};
```
