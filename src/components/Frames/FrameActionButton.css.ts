import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

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
    transition: 'fast',
    padding: 'none',
  }),
  {
    position: 'relative',
    backgroundColor: 'transparent',
    borderRadius: vars.radii.small,
    color: foreground,
    isolation: 'isolate',
    outline: 'none',
    selectors: {
      ['&[data-pressed], &:active']: {
        transform: 'scale(.95)',
      },
      ['&::after']: {
        content: '',
        position: 'absolute',
        transition: 'transform 100ms ease',
        inset: calc(vars.space.xxsmall).negate().toString(),
        backgroundColor: foreground,
        borderRadius: vars.radii.small,
      },
      [`&:not(:hover, [data-popup-open])::after`]: {
        opacity: 0,
      },
      ['&:hover, &[data-popup-open]:not(:focus-visible)']: {
        color: colorPaletteVars.foreground.neutralInverted,
      },
      ['&:focus-visible::after']: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
      },
      ['&:focus-visible:not(:hover)::after']: {
        background: 'transparent',
      },
    },
  },
]);

export const tone = styleVariants({
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

const size = '16px';
globalStyle(`${button} > svg`, {
  display: 'block',
  height: size,
  width: size,
  position: 'relative',
  zIndex: 1,
});
