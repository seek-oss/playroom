---
'playroom': minor
---

Enable embedded CSS formatting on save

CSS authored inside `style` tags inside a playroom will now be formatted as CSS when wrapped in a `css` template literal tag. This takes advantage of [prettier's embedded language formatting capabilities].

A `css` template literal tag can be injected into your playroom scope via the [custom scope] feature:

```js
// customScope.js

export default () => {
  return {
    css: (css) => css,
  };
};
```

This template literal tag can then be used in your playroom:

```jsx
<style>
  {css`
    .foo {
      color: red;
    }
  `}
</style>
```

[custom scope]: https://github.com/seek-oss/playroom?tab=readme-ov-file#custom-scope
[prettier's embedded language formatting capabilities]: https://prettier.io/docs/options#embedded-language-formatting
