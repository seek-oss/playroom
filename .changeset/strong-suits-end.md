---
'playroom': minor
---

Add custom entry file support

You can provide a custom entry file via the `entry` option, which is a path to a file that runs some code before everything else. For example, if you wanted to apply a CSS reset or other global styles, polyfills etc.:

```js
import '../path/to/your/theming-system/reset';
import '../path/to/your/theming-system/global-styles.css';
```
