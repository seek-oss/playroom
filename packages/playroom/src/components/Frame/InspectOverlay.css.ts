import { style } from '@vanilla-extract/css';

import { inspectOverlay } from '../../css/palettes';

// Rendered in frames, so don't use theme vars or sprinkles as they add `:root` styles
export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 99999,
  cursor: 'crosshair',
});

export const highlight = style({
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 99999,
  background: inspectOverlay,
  transition: 'all 50ms ease',
  transitionDelay: '50ms',
});
