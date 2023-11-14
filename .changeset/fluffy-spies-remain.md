---
'playroom': minor
---

Adds support for vite. This allows user to configure a bundler, by specifying a `bundler` option in their Playroom config.

```js
// playroom.config.js

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
};
```
