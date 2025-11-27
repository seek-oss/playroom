import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../../css/sprinkles.css';

const fieldIndicatorSize = '20px';

export const checkboxLabel = style([
  sprinkles({
    position: 'relative',
    display: 'block',
    borderRadius: 'small',
    userSelect: 'none',
  }),
]);

export const realCheckbox = style([
  sprinkles({
    position: 'absolute',
    pointerEvents: 'none',
    opacity: 0,
    right: 0,
  }),
  {},
]);

export const fakeCheckbox = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'small',
    zIndex: 1,
  }),
  {
    height: fieldIndicatorSize,
    width: fieldIndicatorSize,
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    border: `1px solid ${colorPaletteVars.border.standard}`,
    isolation: 'isolate',
    selectors: {
      [`${realCheckbox}:focus-visible ~ &`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 2,
      },
    },
  },
]);

export const checkboxItemIndicator = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    position: 'relative',
    height: fieldIndicatorSize,
    width: fieldIndicatorSize,
    color: colorPaletteVars.foreground.neutral,
    zIndex: 1,
    selectors: {
      [`${realCheckbox}[aria-disabled="true"] ~ ${fakeCheckbox} > &`]: {
        color: colorPaletteVars.foreground.secondary,
      },
    },
  },
]);
