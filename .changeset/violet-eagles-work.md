---
'playroom': patch
---

Evaluate `scope` in the context of `FrameComponent`

Ensure the provided `scope` is evaluated within the context of the provided `FrameComponent`.
This was a regression in the recent refactor, and fixing it enables usage of React Context by wrapping a Provider in the `FrameComponent` and retrieving its value via `scope`.
