---
'playroom': patch
---

Disable snippet previews while the snippets panel is closing.

Previously, snippet previews could be triggered while the snippet panel was closing, causing preview frames to enter an invalid state.
Previewing a snippet will now only work when the snippet panel is open.
