import { style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const fieldContainer = sprinkles({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

const titleWeight = 'strong';
const titleSize = 'standard';

const paddingX = 'small';
export const textField = style([
  sprinkles({
    position: 'absolute',
    font: titleSize,
    fontWeight: titleWeight,
    boxSizing: 'border-box',
    borderRadius: 'medium',
    textAlign: 'center',
    paddingX,
    paddingY: 'xxsmall',
    border: 0,
    left: 0,
    right: 0,
    opacity: 0,
  }),
  {
    outline: 'none',
    height: vars.buttonSizes.medium,
    color: colorPaletteVars.foreground.neutral,
    background: 'transparent',
    '::placeholder': {
      color: colorPaletteVars.foreground.secondary,
      fontWeight: titleWeight,
    },
    selectors: {
      [comma(
        '&:hover:not(:focus-visible)',
        '&:hover:not(:focus-visible)::placeholder'
      )]: {
        background: colorPaletteVars.background.selection,
        opacity: 1,
        color: 'transparent',
      },
      '&:hover:not(:focus-visible)::selection': {
        background: 'transparent',
      },
      '&:focus-visible': {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 0,
        opacity: 1,
      },
      '&:focus-visible::placeholder': {
        color: 'transparent',
      },
    },
  },
]);

export const readOnlyText = style([
  sprinkles({
    position: 'relative',
    boxSizing: 'border-box',
    pointerEvents: 'none',
    paddingX,
    userSelect: 'none',
    font: titleSize,
    fontWeight: titleWeight,
    textAlign: 'center',
  }),
  {
    maxWidth: '50vw',
    minWidth: 240,
    whiteSpace: 'pre',
    color: colorPaletteVars.foreground.neutral,
    selectors: {
      [`${textField}:focus-visible ~ &`]: {
        opacity: 0,
      },
    },
  },
]);

export const noTitle = style({
  color: colorPaletteVars.foreground.secondary,
});
