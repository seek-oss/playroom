import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const fieldContainer = sprinkles({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

export const titleWeight = 'strong';
export const titleSize = 'standard';

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
      fontWeight: 'normal',
    },
    selectors: {
      '&:hover:not(:focus-visible)': {
        background: colorPaletteVars.background.selection,
        opacity: 1,
        color: 'transparent',
      },
      '&:focus-visible': {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
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
  }),
  {
    maxWidth: '50vw',
    minWidth: 240,
    selectors: {
      [`${textField}:focus-visible ~ &`]: {
        opacity: 0,
      },
    },
  },
]);

export const preserveWhiteSpace = style({
  whiteSpace: 'pre',
});
