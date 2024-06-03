import { colorPaletteVars, sprinkles, vars } from '../sprinkles.css';
import { style } from '@vanilla-extract/css';

export const fieldset = sprinkles({
  border: 0,
  margin: 'none',
  padding: 'none',
});

export const keyboardShortcutsRow = sprinkles({
  alignItems: 'center',
});

export const keyboardShortcutTitle = style({
  flex: 1,
});

export const keyboardShortcutKeys = style([
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  sprinkles({
    gap: 'xsmall',
  }),
]);

export const kbd = style([
  sprinkles({
    borderRadius: 'large',
    paddingY: 'xsmall',
    textAlign: 'center',
  }),
  {
    display: 'inline-block',
    background: colorPaletteVars.background.neutral,
    paddingLeft: 8,
    paddingRight: 8,
    fontFamily: 'system-ui',
    minWidth: 16,
  },
]);

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
