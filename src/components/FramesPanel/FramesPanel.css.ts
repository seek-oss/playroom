import { globalStyle, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const padding = 'xxsmall';
export const reset = style([
  sprinkles({
    position: 'relative',
    font: 'small',
    border: 0,
    padding,
    appearance: 'none',
  }),
  {
    color: 'currentColor',
    backgroundColor: 'transparent',
    outline: 'none',
    textDecoration: 'underline',
    margin: calc(vars.space[padding]).negate().toString(),
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: vars.radii.small,
      boxShadow: colorPaletteVars.shadows.focus,
      cursor: 'pointer',
      opacity: 0,
      transform: 'scale(0.8)',
      transition: vars.transition.medium,
    },
    selectors: {
      [`&:focus::before, &:hover::before`]: {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  },
]);

export const label = sprinkles({
  cursor: 'pointer',
});

const checkboxSize = '20px';
export const checkbox = style([
  sprinkles({
    position: 'absolute',
    margin: 'none',
    left: 0,
    right: 0,
    opacity: 0,
  }),
  {
    height: checkboxSize,
    width: checkboxSize,
  },
]);

const checkboxPadding = 'xxxsmall';
export const fakeCheckbox = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 'medium',
    padding: checkboxPadding,
    pointerEvents: 'none',
  }),
  {
    flexGrow: 0,
    flexShrink: 0,
    height: calc(checkboxSize)
      .subtract(calc(vars.space[checkboxPadding]).multiply(2))
      .toString(),
    width: calc(checkboxSize)
      .subtract(calc(vars.space[checkboxPadding]).multiply(2))
      .toString(),
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: vars.radii.small,
      boxShadow: colorPaletteVars.shadows.focus,
      transition: vars.transition.medium,
      opacity: 0,
      transform: 'scale(0.5)',
    },
    '::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: vars.radii.small,
      boxShadow: 'inset 0 0 0px 1px currentColor',
      background: colorPaletteVars.background.surface,
    },
    selectors: {
      [`${checkbox}:hover:not(:focus) ~ &::before, ${checkbox}:focus ~ &::before`]:
        {
          opacity: 1,
          transform: 'scale(1)',
        },
    },
  },
]);

globalStyle(`${fakeCheckbox} > svg`, {
  height: '100%',
  width: '100%',
  opacity: 0,
  transform: 'scale(0.6)',
  transition: vars.transition.fast,
  transitionDelay: '0.1s, 0.3s',
  zIndex: 1,
});

globalStyle(`${checkbox}:checked ~ ${fakeCheckbox} > svg `, {
  opacity: 1,
  transform: 'none',
  transition: vars.transition.fast,
});
