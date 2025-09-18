import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const textField = style([
  sprinkles({
    font: 'standard',
    fontWeight: 'strong',
    boxSizing: 'border-box',
    borderRadius: 'small',
    textAlign: 'center',
    border: 0,
  }),
  {
    outline: 'none',
    width: 250,
    height: 40,
    color: colorPaletteVars.foreground.neutral,
    background: 'transparent',
    border: '1px solid transparent',
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
      fontWeight: 'normal',
    },
    selectors: {
      '&:hover:not(:focus-visible)': {
        background: colorPaletteVars.background.selection,
      },
      '&:focus-visible': {
        borderColor: colorPaletteVars.background.accent,
      },
      '&:focus-visible::placeholder': {
        color: 'transparent',
      },
    },
  },
]);
