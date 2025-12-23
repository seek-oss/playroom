import { style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const root = style([
  sprinkles({
    display: 'flex',
    gap: 'xxsmall',
    padding: 'xxsmall',
    borderRadius: 'medium',
    boxShadow: 'small',
    transition: 'fast',
  }),
  {
    backgroundColor: colorPaletteVars.background.floating,
    outline: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);

export const button = style([
  sprinkles({
    paddingX: 'xsmall',
    paddingY: 'xxsmall',
    borderRadius: 'small',
    display: 'flex',
    alignItems: 'center',
    gap: 'xsmall',
    border: 0,
    userSelect: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
  }),
  {
    background: 'transparent',
    height: vars.buttonSizes.medium,
    color: colorPaletteVars.foreground.neutral,
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 2,
    },
    selectors: {
      [comma('&:hover', '&[data-popup-open]')]: {
        backgroundColor: colorPaletteVars.background.selection,
      },
      '&[aria-disabled="true"]': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
      '&[aria-disabled="true"]:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
]);
