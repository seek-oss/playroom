import { style } from '@vanilla-extract/css';

import { minTouchableBeforePseudo } from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

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

export const base = style([
  sprinkles({
    borderRadius: 'medium',
    overflow: 'hidden',
    paddingY: 'xsmall',
    paddingX: 'small',
    font: 'standard',
    transition: 'fast',
  }),
  minTouchableBeforePseudo,
  {
    color: colorPaletteVars.foreground.neutral,
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
        zIndex: -1,
      },
      ['&:hover::after']: {
        opacity: 1,
      },
      ['&:focus-visible::after']: {
        opacity: 1,
      },
      ['&:active']: {
        transform: 'scale(0.97)',
      },
      ['&:focus-visible']: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 0,
      },
    },
  },
]);

export const tone = {
  positive: style({
    color: colorPaletteVars.foreground.positive,
    borderColor: colorPaletteVars.foreground.positive,
    selectors: {
      ['&::after']: {
        backgroundColor: colorPaletteVars.background.positive,
      },
    },
  }),
  critical: style({
    color: colorPaletteVars.foreground.critical,
    borderColor: colorPaletteVars.foreground.critical,
    selectors: {
      ['&::after']: {
        backgroundColor: colorPaletteVars.background.critical,
      },
    },
  }),
};
