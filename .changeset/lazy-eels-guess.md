---
'playroom': minor
---

Improved handling of rendering errors

Errors occurring during render no longer replace the frame contents with a red error message.
Instead, the error is caught and overlaid on top of the last successful render result (when possible).
