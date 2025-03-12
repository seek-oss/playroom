---
'playroom': patch
---

Use the URL hash for passing params to each playroom iframe even when `paramType: 'search'` is configured

This change prevents a full React re-render from occurring whenever code is changed in a playroom in projects that configure `paramType: 'search'`, resulting in a much smoother prototyping experience.
