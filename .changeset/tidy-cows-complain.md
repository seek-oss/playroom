---
'playroom': patch
---

Allow overriding Webpack module rules

Consumers may have complex Webpack configurations that can clash with Playroom's.
In this case, it's useful to be able to override the module rules that Playroom defines.
For example, overriding loaders defined for CSS files:

```js
// playroom.config.js
module.exports = {
  webpackConfig: () => ({
    module: {
      rules: [
        // use your own CSS loaders
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
  }),
};
```
