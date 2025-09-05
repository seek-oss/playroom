import { style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

export const root = sprinkles({
  position: 'relative',
});

export const select = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    width: 'full',
    opacity: 0,
    font: 'standard',
  }),
  {}, // Required to create a style reference used by label for focus ring
]);

export const label = style([
  sprinkles({
    userSelect: 'none',
    pointerEvents: 'none',
    borderRadius: 'small',
  }),
  {
    selectors: {
      [`${select}:focus-visible ~ &`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 4,
      },
    },
  },
]);

export const row = sprinkles({
  display: 'flex',
  alignItems: 'center',
});

export const column = style([
  sprinkles({
    display: 'block',
  }),
  {
    minWidth: 0,
  },
]);

export const minColumn = style({
  flexShrink: 0,
});
