---
'playroom': patch
---

**Duplicate**: Prefer the current title from app state when building the duplicate URL

Avoids using a stale title from the URL while the debounced URL update is still pending.
