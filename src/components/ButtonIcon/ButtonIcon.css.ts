import {
  createVar,
  globalStyle,
  style,
  styleVariants,
} from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { comma } from '../../css/delimiters';

import { minTouchableBeforePseudo } from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const sizeVar = createVar();
export const foreground = createVar();

export const button = style([
  sprinkles({
    boxSizing: 'border-box',
    position: 'relative',
    display: 'block',
    margin: 'none',
    padding: 'none',
    userSelect: 'none',
    border: 0,
    appearance: 'none',
    borderRadius: 'medium',
  }),
  minTouchableBeforePseudo,
  {
    background: 'transparent',
    outline: 'none',
    height: sizeVar,
    width: sizeVar,
  },
]);

const paddingVar = createVar();

export const content = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    boxSizing: 'border-box',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'fast',
    height: 'full',
    width: 'full',
  }),
  {
    padding: paddingVar,
    borderRadius: 'inherit',
    background: 'transparent',
    outline: 'none',
    color: foreground,
    isolation: 'isolate',
    selectors: {
      [comma(`${button}[data-pressed] &`, `${button}:active &`)]: {
        transform: 'scale(.95)',
      },
      [`${button}:focus-visible &`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
      },
    },
  },
]);

export const size = styleVariants(vars.buttonSizes, (buttonSize, name) => ({
  vars: {
    [sizeVar]: buttonSize,
    [paddingVar]: name === 'small' ? '6px' : vars.space.xsmall,
  },
}));

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
      outlineOffset: -1,
      selectors: {
        [comma('&:hover', '[data-popup-open] > &')]: {
          backgroundColor: colorPaletteVars.background.selection,
        },
      },
    },
  ],
  solid: [
    {
      vars: {
        [foreground]: colorPaletteVars.foreground.neutralInverted,
      },
      backgroundColor: colorPaletteVars.background.secondaryAccent,
      selectors: {
        [comma('&:hover', '[data-popup-open] > &')]: {
          backgroundColor: colorPaletteVars.background.secondaryAccentLight,
        },
      },
    },
  ],
  transparent: [
    {
      selectors: {
        [comma('&:hover', '[data-popup-open] > &')]: {
          backgroundColor: colorPaletteVars.background.selection,
        },
      },
    },
  ],
});

const viewboxGutter = '2px';
export const bleed = style({
  margin: calc(paddingVar).add(viewboxGutter).negate().toString(),
});

globalStyle(`${content} > svg`, {
  display: 'block',
  height: '100%',
  width: '100%',
});
