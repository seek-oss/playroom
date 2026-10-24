---
'playroom': patch
---

Stop applying Playroom's own global styles inside frames

Frames previously loaded Playroom's global theme variables, which were applied to `:root` alongside components styles.
Frames now only load the styles for the inspect overlay, which are scoped to the overlay itself.
