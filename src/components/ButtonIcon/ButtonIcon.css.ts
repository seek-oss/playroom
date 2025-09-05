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
    padding: 'none',
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
    height: sizeVar,
    width: sizeVar,
    isolation: 'isolate',
    // Background pseudo element
    '::after': {
      content: '',
      position: 'absolute',
      inset: calc(vars.space.xsmall).negate().toString(),
      transition: vars.transition.fast,
      backgroundColor: colorPaletteVars.background.neutral,
      borderRadius: vars.radii.full,
      zIndex: -1,
    },
    selectors: {
      [`&:not(:hover, :focus-visible, [data-popup-open])::after`]: {
        opacity: 0,
        transform: 'scale(.5)',
      },
      ['&:active']: {
        transform: 'scale(.9)',
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

globalStyle(`${button} > svg`, {
  display: 'block',
  height: sizeVar,
  width: sizeVar,
});

export const popup = sharedPopupStyles('small');
