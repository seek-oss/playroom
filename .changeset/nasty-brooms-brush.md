---
'playroom': patch
---

Tighten webpack config merge rules to prevent replacing playroom webpack config with user-provided webpack config

When merging user-provided webpack config, a module rule's `test`, `include` and `exclude` property will all be compared.
