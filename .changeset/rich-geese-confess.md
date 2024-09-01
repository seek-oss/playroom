---
'playroom': patch
---

start: Disable webpack error overlay

Prevent the default webpack dev server error overlay from blocking the preview frames in `start` mode.
Playroom handles its own errors, and this would block the preview frames and need to be dismissed manually.
