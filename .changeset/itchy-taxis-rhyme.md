---
'playroom': minor
---

Add support for specifying default subsets of themes and screen widths via the config.

#### Example usage

```js
// playroom.config.js
module.exports = {
  ...,
  defaultVisibleWidths: [
    // subset of widths to display on first load
  ],
  defaultVisibleThemes: [
    // subset of themes to display on first load
  ],
}
```
