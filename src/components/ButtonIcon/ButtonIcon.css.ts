import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import {
  minTouchableBeforePseudo,
  sharedPopupStyles,
} from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const sizeVar = createVar();
const foreground = createVar();

export const button = style([
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
  }),
  minTouchableBeforePseudo,
  {
    background: 'transparent',
    outline: 'none',
    color: foreground,
    isolation: 'isolate',
    // Background pseudo element
    '::after': {
      content: '',
      position: 'absolute',
      transition: vars.transition.fast,
      zIndex: -1,
    },
    selectors: {
      ['&[data-pressed], &:active']: {
        transform: 'scale(.95)',
      },
      [`&:focus-visible::after`]: {
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
    sprinkles({ padding: 'xsmall' }),
    {
      height: 'auto',
      width: 'auto',
      '::after': {
        inset: 0,
        backgroundColor: colorPaletteVars.background.floating,
        borderRadius: vars.radii.medium,
        outline: `1px solid ${colorPaletteVars.border.standard}`,
      },
      selectors: {
        ['&:hover::after']: {
          backgroundColor: colorPaletteVars.background.selection,
        },
      },
    },
  ],
  transparent: [
    sprinkles({ padding: 'none' }),
    {
      height: sizeVar,
      width: sizeVar,
      '::after': {
        inset: calc(vars.space.xxsmall).negate().toString(),
        backgroundColor: foreground,
        borderRadius: vars.radii.medium,
      },
      selectors: {
        [`&:not(:hover, :focus-visible, [data-popup-open])::after`]: {
          opacity: 0,
        },
        ['&:hover, &:focus-visible, &[data-popup-open]']: {
          color: colorPaletteVars.foreground.neutralInverted,
        },
      },
    },
  ],
});

globalStyle(`${button} > svg`, {
  display: 'block',
  height: sizeVar,
  width: sizeVar,
});

export const popup = sharedPopupStyles('small');
