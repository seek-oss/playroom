import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const textField = style([
  sprinkles({
    font: 'large',
    paddingX: 'small',
    boxSizing: 'border-box',
    borderRadius: 'medium',
  }),
  {
    width: 300,
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: colorPaletteVars.background.surface,
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
    border: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);
