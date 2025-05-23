import { style, createVar } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { sprinkles, colorPaletteVars } from '../sprinkles.css';
import { vars } from '../vars.css';

export const reset = style([
  sprinkles({
    boxSizing: 'border-box',
    border: 0,
    margin: 'none',
    padding: 'none',
    appearance: 'none',
    userSelect: 'none',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    placeItems: 'center',
  }),
  {
    background: 'transparent',
    outline: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    height: vars.touchableSize,
    WebkitTapHighlightColor: 'transparent',
  },
]);

const highlightColor = createVar();

export const base = style([
  sprinkles({
    borderRadius: 'large',
    paddingY: 'none',
    paddingX: 'large',
    font: 'standard',
  }),
  {
    vars: {
      [highlightColor]: 'currentColor',
    },
    color: highlightColor,
    border: `1px solid ${colorPaletteVars.foreground.neutralSoft}`,
    height: calc(vars.grid).multiply(9).toString(),
    ':hover': {
      vars: {
        [highlightColor]: colorPaletteVars.foreground.accent,
      },
      borderColor: highlightColor,
    },
    ':active': {
      transform: 'scale(0.98)',
    },
    '::after': {
      content: '',
      position: 'absolute',
      transform: 'translateY(-50%)',
      minHeight: vars.touchableSize,
      minWidth: vars.touchableSize,
      left: calc(vars.grid).multiply(2).negate().toString(),
      right: calc(vars.grid).multiply(2).negate().toString(),
      height: '100%',
      top: '50%',
    },
    selectors: {
      [`&:focus:not(:active):not(:hover):not([disabled])`]: {
        boxShadow: colorPaletteVars.shadows.focus,
      },
    },
  },
]);

export const positive = style({
  vars: {
    [highlightColor]: `${colorPaletteVars.foreground.positive} !important`,
  },
  borderColor: highlightColor,
});

export const iconContainer = style([
  sprinkles({ position: 'relative', paddingLeft: 'small' }),
  {
    top: '1px',
  },
]);
