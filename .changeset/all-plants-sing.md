---
'playroom': patch
---

**types:** Update `PlayroomConfig` and make available to consumers

Enable type-safe configuration files by exporting `PlayroomConfig` type.

```ts
// playroom.config.ts
import type { PlayroomConfig } from 'playroom';

export default {
  ...
} satisfies PlayroomConfig;
```
