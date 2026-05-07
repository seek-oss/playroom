import { style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

export const overlay = style([
  sprinkles({
    position: 'fixed',
    inset: 0,
  }),
  {
    zIndex: 99999,
    cursor: 'crosshair',
  },
]);

export const highlight = style([
  sprinkles({
    position: 'fixed',
    pointerEvents: 'none',
  }),
  {
    zIndex: 99999,
    background: colorPaletteVars.background.inspectOverlay,
    transition: 'all 50ms ease',
  },
]);
