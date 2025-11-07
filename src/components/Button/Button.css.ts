import { createVar, style, styleVariants } from '@vanilla-extract/css';

import { minTouchableBeforePseudo } from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const sizeVar = createVar();

const reset = style([
  sprinkles({
    boxSizing: 'border-box',
    border: 0,
    margin: 'none',
    appearance: 'none',
    userSelect: 'none',
  }),
  {
    background: 'transparent',
    outline: 'none',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
]);

export const base = style([
  reset,
  sprinkles({
    position: 'relative',
    borderRadius: 'medium',
    overflow: 'hidden',
    paddingX: 'small',
    transition: 'fast',
    display: 'flex',
    placeItems: 'center',
  }),
  minTouchableBeforePseudo,
  {
    border: `1px solid ${colorPaletteVars.border.standard}`,
    backgroundColor: colorPaletteVars.background.surface,
    isolation: 'isolate',
    outline: 'none',
    transformOrigin: 'center',
    selectors: {
      ['&::after']: {
        content: '',
        position: 'absolute',
        inset: 0,
        backgroundColor: colorPaletteVars.background.selection,
        opacity: 0,
        transition: 'opacity 120ms ease',
        pointerEvents: 'none',
      },
      ['&:hover::after']: {
        opacity: 1,
      },
      ['&:focus-visible::after']: {
        opacity: 1,
      },
      ['&:active:not([disabled])']: {
        transform: 'scale(0.97)',
      },
      ['&:focus-visible']: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 0,
      },
    },
  },
]);

/**
 * Fix to ensure text is on top of `after` pseudo that sets the background colour.
 * Without this, Safari would shift the text around on hover
 */
export const labelWrapper = style([
  sprinkles({
    position: 'relative',
    zIndex: 1,
  }),
  {
    isolation: 'isolate',
  },
]);

export const height = {
  explicit: style([
    sprinkles({ paddingY: 'xxsmall' }),
    {
      height: sizeVar,
    },
  ]),
  content: sprinkles({ paddingY: 'small' }),
};

export const tone = {
  positive: style({
    borderColor: colorPaletteVars.foreground.positive,
    selectors: {
      ['&::after']: {
        backgroundColor: colorPaletteVars.background.positive,
      },
    },
  }),
  critical: style({
    borderColor: colorPaletteVars.foreground.critical,
    selectors: {
      ['&::after']: {
        backgroundColor: colorPaletteVars.background.critical,
      },
    },
  }),
};

export const size = styleVariants(vars.buttonSizes, (buttonSize) => ({
  vars: {
    [sizeVar]: buttonSize,
  },
}));
