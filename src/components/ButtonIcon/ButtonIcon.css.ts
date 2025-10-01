import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

import {
  minTouchableBeforePseudo,
  sharedPopupStyles,
} from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

export const sizeVar = createVar();
export const foreground = createVar();

export const button = style([
  sprinkles({
    boxSizing: 'border-box',
    margin: 'none',
    userSelect: 'none',
    border: 0,
    appearance: 'none',
    borderRadius: 'medium',
  }),
  {
    background: 'transparent',
    padding: 0,
  },
]);

export const content = style([
  sprinkles({
    boxSizing: 'border-box',
    margin: 'none',
    userSelect: 'none',
    border: 0,
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    transition: 'fast',
    padding: 'xsmall',
  }),
  minTouchableBeforePseudo,
  {
    borderRadius: 'inherit',
    background: 'transparent',
    outline: 'none',
    color: foreground,
    isolation: 'isolate',
    height: 'auto',
    width: 'auto',
    selectors: {
      ['&[data-pressed], &:active']: {
        transform: 'scale(.95)',
      },
      [`${button}:focus-visible &`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
      },
    },
  },
]);

export const size = styleVariants({
  small: {
    vars: {
      [sizeVar]: '16px',
    },
  },
  medium: {
    vars: {
      [sizeVar]: '20px',
    },
  },
  large: {
    vars: {
      [sizeVar]: '24px',
    },
  },
});

export const tone = styleVariants({
  neutral: {
    vars: {
      [foreground]: colorPaletteVars.foreground.neutral,
    },
  },
  accent: {
    vars: {
      [foreground]: colorPaletteVars.foreground.accent,
    },
  },
  positive: {
    vars: {
      [foreground]: colorPaletteVars.foreground.positive,
    },
  },
});

export const variant = styleVariants({
  standard: [
    {
      backgroundColor: colorPaletteVars.background.surface,
      outline: `1px solid ${colorPaletteVars.border.standard}`,
      selectors: {
        [comma('&:hover', '[data-popup-open] > &')]: {
          backgroundColor: colorPaletteVars.background.selection,
        },
      },
    },
  ],
  solid: [
    {
      color: colorPaletteVars.foreground.neutralInverted,
      backgroundColor: colorPaletteVars.background.secondaryAccent,
      selectors: {
        [comma('&:hover', '[data-popup-open] > &')]: {
          backgroundColor: colorPaletteVars.background.secondaryAccentLight,
        },
      },
    },
  ],
});

globalStyle(`${content} > svg`, {
  display: 'block',
  height: sizeVar,
  width: sizeVar,
});

export const popup = style([
  sharedPopupStyles,
  sprinkles({ padding: 'xsmall', borderRadius: 'medium' }),
  {
    backgroundColor: colorPaletteVars.background.tooltip,
    vars: {
      [colorPaletteVars.foreground.neutral]:
        colorPaletteVars.foreground.tooltip,
    },
  },
]);
