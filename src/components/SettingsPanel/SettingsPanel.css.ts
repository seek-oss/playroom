import { style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const fieldset = sprinkles({
  border: 0,
  margin: 'none',
  padding: 'none',
});

export const realRadio = style([
  sprinkles({
    position: 'absolute',
    opacity: 0,
    pointerEvents: 'none',
  }),
  {
    height: vars.touchableSize,
    width: vars.touchableSize,
  },
]);

export const label = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }),
  {
    height: vars.touchableSize,
    width: vars.touchableSize,
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colorPaletteVars.background.selection,
      borderRadius: vars.radii.medium,
      transition: vars.transition.medium,
      opacity: 0,
      transform: 'scale(0.8)',
    },
    selectors: {
      [[
        `${realRadio}:checked ~ &`,
        `html:not([data-playroom-dark]) ${realRadio}:hover ~ &`,
      ].join(',')]: {
        color: colorPaletteVars.foreground.accent,
      },
      [`${realRadio}:focus ~ &::before, ${realRadio}:hover ~ &::before`]: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  },
]);
