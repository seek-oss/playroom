---
'playroom': minor
---

Enable embedded CSS formatting on save

CSS authored inside `style` tags with a `jsx` attribute will now be formatted as CSS. This takes advantage of [prettier's embedded language formatting capabilities].

For example:

```jsx
<style jsx>
  {`
    .foo {
      color: red;
    }
  `}
</style>
```

[prettier's embedded language formatting capabilities]: https://prettier.io/docs/options#embedded-language-formatting
