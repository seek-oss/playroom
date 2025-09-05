import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const textField = style([
  sprinkles({
    font: 'large',
    paddingX: 'small',
    boxSizing: 'border-box',
    borderRadius: 'medium',
    textAlign: 'center',
    border: 0,
  }),
  {
    outline: 'none',
    width: 300,
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: 'transparent',
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
  },
]);

export const label = style([
  sprinkles({
    position: 'relative',
  }),
  {
    '::after': {
      content: '',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 4,
      height: 2,
      borderRadius: vars.radii.medium,
      background: colorPaletteVars.background.accent,
      transition: vars.transition.medium,
    },
    selectors: {
      '&:not(:focus-within)::after': {
        opacity: 0,
        transform: 'scaleX(0.8)',
      },
    },
  },
]);
