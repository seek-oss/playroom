import { colorPaletteVars, sprinkles, vars } from '../sprinkles.css';
import { globalStyle, style } from '@vanilla-extract/css';

export const fieldset = sprinkles({
  border: 0,
  margin: 'none',
  padding: 'none',
});

export const radioContainer = sprinkles({
  display: 'flex',
  paddingTop: 'medium',
});

export const keyboardShortcutRow = style({
  display: 'flex',
  alignItems: 'center',
});

globalStyle(`${keyboardShortcutRow} > *:first-child`, {
  flex: 1,
});

globalStyle(`${keyboardShortcutRow} > *:nth-child(2)`, {
  flex: '0 0 43%',
});

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

export const textField = style([
  sprinkles({
    font: 'large',
    width: 'full',
    paddingX: 'large',
    boxSizing: 'border-box',
    borderRadius: 'medium',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: colorPaletteVars.background.surface,
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
    border: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);
