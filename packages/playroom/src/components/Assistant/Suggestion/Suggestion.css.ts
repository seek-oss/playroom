import { style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../../css/sprinkles.css';

export const root = style([
  sprinkles({
    position: 'relative',
    padding: 'xsmall',
    paddingLeft: 'medium',
    borderRadius: 'medium',
  }),
  {
    border: `1px solid ${colorPaletteVars.border.standard}`,
    maxWidth: '300px',
  },
]);

export const selected = style([
  {
    background: colorPaletteVars.background.selection,
    opacity: 0.7,
  },
]);

export const button = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    padding: 'none',
    borderRadius: 'medium',
    border: 0,
  }),
  {
    appearance: 'none',
    background: 'transparent',
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
    },
    ':hover': {
      backgroundColor: colorPaletteVars.background.selection,
      opacity: 0.4,
    },
  },
]);

export const label = style({
  isolation: 'isolate',
  pointerEvents: 'none',
});

export const actionsContainer = style({
  pointerEvents: 'auto',
});
