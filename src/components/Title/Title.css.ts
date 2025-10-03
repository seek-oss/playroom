import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const textField = style([
  sprinkles({
    font: 'standard',
    fontWeight: 'strong',
    boxSizing: 'border-box',
    borderRadius: 'medium',
    textAlign: 'center',
    paddingX: 'xsmall',
    paddingY: 'xxsmall',
    border: 0,
  }),
  {
    outline: 'none',
    width: 250,
    height: vars.buttonSizes.medium,
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
