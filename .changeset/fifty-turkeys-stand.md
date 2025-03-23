---
'playroom': minor
---

Replace `fast-glob` dependency with [`tinyglobby`], removing 6 transitive dependencies

BREAKING CHANGE:

While `tinyglobby` aims to mimic `fast-glob`'s behaviour, not all behavior is guaranteed to be the same. The `typescriptFiles` property in your playroom config is the only property that is affected by this change. Please ensure any custom globs are functioning as expected.

[`tinyglobby`]: https://github.com/SuperchupuDev/tinyglobby
