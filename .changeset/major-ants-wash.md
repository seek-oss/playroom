---
'playroom': minor
---

frameSettings: Add support to custom frame props

Add `frameSettings` config option to enable per-frame toggleable settings.
Allows playroom owners to define boolean controls (e.g., dark mode, compact mode) that users can independently toggle for each frame, with values passed to the custom `FrameComponent` for conditional rendering.

### Example Usage

```js
// playroom.config.js
export default {
  ...,
  frameSettings: [
    { id: 'darkMode', label: 'Dark Mode', defaultValue: false }
  ],
};

// FrameComponent.tsx
export default ({ frameSettings, children }) => (
  <ThemeProvider darkMode={frameSettings?.darkMode}>{children}</ThemeProvider>
);
```
