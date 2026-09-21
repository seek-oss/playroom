---
'playroom': minor
---

Add `defaultEditorPosition` config option

Sets where the code editor sits on first load, matching the "Editor Position" menu:

```js
// playroom.config.js
module.exports = {
  defaultEditorPosition: 'left', // default is 'bottom'
};
```

A position chosen from the menu is still remembered per user and takes precedence over this option.
