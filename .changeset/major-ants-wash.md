---
'playroom': minor
---

frameSettings: Add support to custom frame props

Add `frameSettings` config option to enable per-frame toggleable settings.
Allows playroom owners to define boolean controls (e.g., RTL layout, debugging touch targets, etc) that users can independently toggle for each frame, with values passed to the custom `FrameComponent` for conditional rendering.

### Example Usage

```js
// playroom.config.js
export default {
  ...,
  frameSettings: [
    { id: 'rtl', label: 'RTL Layout', defaultValue: false }
  ],
};

// FrameComponent.tsx
export default ({ frameSettings, children }) => (
  <ThemeProvider rtl={frameSettings?.rtl}>{children}</ThemeProvider>
);
```
