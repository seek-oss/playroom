---
'playroom': patch
---

Restrict `typescript` dependency range to `^5.0.0 || ^6.0.0`

Playroom's `typescript` dependency range was previously `>=5.0.0`, but TypeScript's v7 release does not have a compatible API with v5 and v6. The dependency range has been adjust to accurately reflect the versions of TypeScript that Playroom is currently compatible with.
