---
'playroom': minor
---

Add support for loading mjs config files

Consumers should now be able to write their configuration files using ES modules. This can be achieved by:

1. **Recommended approach**: by renaming their `playroom.config.js` => `playroom.config.mjs` and specifying the `--config` option when running playroom. For example:

```sh
  npx playroom --config ./playroom.config.mjs
```

1. By specifying `"type": "module"` in the package.json, any `.js` files are considered as ES modules. Hence you should be able to load your playroom config without the need to specify the configuration path. ie:

```sh
  npx playroom
```
