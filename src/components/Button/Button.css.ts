import { style, createVar } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

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
    WebkitTapHighlightColor: 'transparent',
  },
]);

const highlightColor = createVar();

export const base = style([
  sprinkles({
    borderRadius: 'medium',
    paddingY: 'xsmall',
    paddingX: 'small',
    font: 'standard',
  }),
  {
    vars: {
      [highlightColor]: 'currentColor',
    },
    color: highlightColor,
    border: `1px solid ${colorPaletteVars.foreground.neutralSoft}`,
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
      width: '100%',
      height: '100%',
      top: '50%',
    },
    selectors: {
      [`&:focus:not(:active):not(:hover):not([disabled])`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 0,
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

export const critical = style({
  vars: {
    [highlightColor]: `${colorPaletteVars.foreground.critical} !important`,
  },
  borderColor: highlightColor,
});

export const iconContainer = style([
  sprinkles({ position: 'relative', paddingLeft: 'xxsmall' }),
  {
    top: '1px',
  },
]);
