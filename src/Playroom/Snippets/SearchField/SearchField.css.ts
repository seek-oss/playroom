import { sprinkles, vars, colorPaletteVars } from './../../sprinkles.css';
import { style } from '@vanilla-extract/css';

export const field = style([
  sprinkles({
    font: 'large',
    border: 0,
    width: 'full',
    paddingX: 'xlarge',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: colorPaletteVars.background.surface,
    ':focus': {
      outline: 'none',
    },
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
  },
]);
