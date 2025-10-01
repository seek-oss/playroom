import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const textField = style([
  sprinkles({
    font: 'standard',
    fontWeight: 'strong',
    boxSizing: 'border-box',
    borderRadius: 'medium',
    textAlign: 'center',
    padding: 'xsmall',
    border: 0,
  }),
  {
    outline: 'none',
    width: 250,
    color: colorPaletteVars.foreground.neutral,
    background: 'transparent',
    '::placeholder': {
      color: colorPaletteVars.foreground.secondary,
      fontWeight: 'normal',
    },
    selectors: {
      '&:hover:not(:focus-visible)': {
        background: colorPaletteVars.background.selection,
      },
      '&:focus-visible': {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
      },
      '&:focus-visible::placeholder': {
        color: 'transparent',
      },
    },
  },
]);
