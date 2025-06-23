import { style } from '@vanilla-extract/css';

import { sprinkles } from '../../css/sprinkles.css';

export const root = sprinkles({
  position: 'relative',
});

export const label = sprinkles({
  userSelect: 'none',
  pointerEvents: 'none',
});

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

export const select = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    width: 'full',
    opacity: 0,
    font: 'standard',
  }),
  {},
]);

export const focusOverlay = style([
  sprinkles({
    position: 'absolute',
    pointerEvents: 'none',
    borderRadius: 'large',
    opacity: 0,
    transition: 'medium',
    boxShadow: 'focus',
  }),
  {
    top: '-4px',
    left: '-4px',
    right: '-4px',
    bottom: '-4px',
    selectors: {
      [`${select}:focus:not(:hover) ~ &`]: {
        opacity: 1,
      },
    },
  },
]);
