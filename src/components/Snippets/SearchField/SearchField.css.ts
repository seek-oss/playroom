import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../../css/sprinkles.css';
import { vars } from '../../../css/vars.css';

export const field = style([
  sprinkles({
    font: 'large',
    border: 0,
    width: 'full',
    paddingX: 'medium',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: 'transparent',
    boxShadow: `inset 0 -1px 0 0 ${colorPaletteVars.border.standard}`,
    ':focus-visible': {
      outline: 'none',
      boxShadow: `inset 0 -2px 0 0 ${colorPaletteVars.border.accent}`,
    },
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
  },
]);
