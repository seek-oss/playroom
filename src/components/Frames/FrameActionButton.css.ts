import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { sharedPopupStyles } from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const sizeVar = createVar();
export const foreground = createVar();

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
    transition: 'fast',
    padding: 'none',
  }),
  {
    position: 'relative',
    backgroundColor: 'transparent',
    borderRadius: vars.radii.small,
    color: foreground,
    isolation: 'isolate',
    selectors: {
      ['&[data-pressed], &:active']: {
        transform: 'scale(.95)',
      },
      ['&::after']: {
        content: '',
        position: 'absolute',
        transition: 'transform 100ms ease',
        zIndex: -1,
        inset: calc(vars.space.xxsmall).negate().toString(),
        backgroundColor: foreground,
        borderRadius: vars.radii.small,
        pointerEvents: 'none',
      },
      [`&:not(:hover, :focus-visible, [data-popup-open])::after`]: {
        opacity: 0,
      },
      ['&:hover, &:focus-visible, &[data-popup-open]']: {
        color: colorPaletteVars.foreground.neutralInverted,
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

globalStyle(`${button} > svg`, {
  display: 'block',
  height: sizeVar,
  width: sizeVar,
  position: 'relative',
  zIndex: 1,
});
