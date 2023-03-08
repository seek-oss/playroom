import { colorPaletteVars, sprinkles, vars } from '../sprinkles.css';
import { style } from '@vanilla-extract/css';

export const fieldset = sprinkles({
  border: 0,
  margin: 'none',
  padding: 'none',
});

export const radioContainer = sprinkles({
  display: 'flex',
  paddingTop: 'medium',
});

export const kbd = style({
  background: '#d1d1d9',
  borderRadius: 5,
  padding: 3,
  fontFamily: 'monospace',
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

export const labelText = sprinkles({
  display: 'block',
  position: 'relative',
  zIndex: 1,
});

export const label = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    marginRight: 'xxsmall',
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
      borderRadius: vars.radii.large,
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
