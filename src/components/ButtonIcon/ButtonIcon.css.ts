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

const sizeVar = createVar();
const foreground = createVar();

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
    height: `${sizeVar} !important`,
    width: `${sizeVar} !important`,
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
    pointerEvents: 'none',
  }),
  {
    padding: paddingVar,
    borderRadius: 'inherit',
    background: 'transparent',
    outline: 'none',
    isolation: 'isolate',
    selectors: {
      [`${button}:active &`]: {
        transform: 'scale(.95)',
      },
      [`${button}:focus-visible &`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
      },
      [`${button}[aria-disabled="true"] &`]: {
        vars: {
          [foreground]: colorPaletteVars.foreground.secondary,
        },
      },
    },
  },
]);

export const size = styleVariants(vars.buttonSizes, (buttonSize, name) => ({
  vars: {
    [sizeVar]: buttonSize,
    [paddingVar]: name === 'small' ? vars.space.xxsmall : vars.space.xsmall,
  },
}));

const foregroundStandard = createVar();
const backgroundStandard = createVar();
const backgroundStandardHover = createVar();

const foregroundSolid = createVar();
const backgroundSolid = createVar();
const backgroundSolidHover = createVar();

const foregroundTransparent = createVar();
const foregroundTransparentHover = createVar();
const backgroundTransparentHover = createVar();

export const tone = styleVariants({
  neutral: {
    vars: {
      [foregroundStandard]: colorPaletteVars.foreground.neutral,
      [backgroundStandard]: colorPaletteVars.background.surface,
      [backgroundStandardHover]: colorPaletteVars.background.selection,
      [foregroundSolid]: colorPaletteVars.foreground.neutralInverted,
      [backgroundSolid]: colorPaletteVars.background.secondaryAccent,
      [backgroundSolidHover]: colorPaletteVars.background.secondaryAccentLight,
      [foregroundTransparent]: colorPaletteVars.foreground.neutral,
      [foregroundTransparentHover]: colorPaletteVars.foreground.neutral,
      [backgroundTransparentHover]: colorPaletteVars.background.selection,
    },
  },
  accent: {
    vars: {
      [foregroundStandard]: colorPaletteVars.foreground.accent,
      [backgroundStandard]: colorPaletteVars.background.surface,
      [backgroundStandardHover]: colorPaletteVars.background.selection,
      [foregroundSolid]: colorPaletteVars.foreground.neutralInverted,
      [backgroundSolid]: colorPaletteVars.foreground.accent,
      [backgroundSolidHover]: colorPaletteVars.background.accentLight,
      [foregroundTransparent]: colorPaletteVars.foreground.accent,
      [foregroundTransparentHover]: colorPaletteVars.foreground.neutralInverted,
      [backgroundTransparentHover]: colorPaletteVars.background.accent,
    },
  },
});

export const variant = styleVariants({
  standard: [
    {
      color: foregroundStandard,
      backgroundColor: backgroundStandard,
      outline: `1px solid ${colorPaletteVars.border.standard}`,
      outlineOffset: -1,
      selectors: {
        [comma(
          `${button}:not([aria-disabled="true"]):hover > &`,
          `${button}:not([aria-disabled="true"]):focus-visible > &`,
          `${button}:not([aria-disabled="true"])[data-popup-open] > &`
        )]: {
          backgroundColor: backgroundStandardHover,
        },
      },
    },
  ],
  solid: [
    {
      color: foregroundSolid,
      backgroundColor: backgroundSolid,
      selectors: {
        [comma(
          `${button}:not([aria-disabled="true"]):hover > &`,
          `${button}:not([aria-disabled="true"]):focus-visible > &`,
          `${button}:not([aria-disabled="true"])[data-popup-open] > &`
        )]: {
          backgroundColor: backgroundSolidHover,
        },
      },
    },
  ],
  transparent: [
    {
      color: foregroundTransparent,
      selectors: {
        [comma(
          `${button}:not([aria-disabled="true"]):hover > &`,
          `${button}:not([aria-disabled="true"]):focus-visible > &`,
          `${button}:not([aria-disabled="true"])[data-popup-open] > &`
        )]: {
          color: foregroundTransparentHover,
          backgroundColor: backgroundTransparentHover,
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
