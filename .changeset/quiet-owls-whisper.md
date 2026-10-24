---
'playroom': minor
---

Deprecate editor hints derived from runtime React `propTypes`

Hints derived from `propTypes` will be removed in the next major version, leaving static types (via TypeScript) as the only source of editor hints.
Playroom now logs a single warning in the editor console listing the components whose hints still come from `propTypes`.

**MIGRATION GUIDE:**

Migrate these components to TypeScript so Playroom can derive hints from their static prop types.
See the [TypeScript Support](https://github.com/seek-oss/playroom#typescript-support) section of the README for configuration options.
