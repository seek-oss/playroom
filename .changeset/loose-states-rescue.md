---
'playroom': minor
---

Improve snippets search ranking algorithm.
Results are now sorted primarily by the `group` property over the `name` property, making it easier to see related snippets together.

Replace [`fuzzy`] dependency with [`fuse.js`] to enable result sorting.

[`fuzzy`]: https://github.com/mattyork/fuzzy?tab=readme-ov-file
[`fuse.js`]: https://github.com/krisk/fuse
