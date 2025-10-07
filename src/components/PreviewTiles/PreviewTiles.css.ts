import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const scaleVar = createVar();

const tileCount = createVar();
const tileGap = 'medium';
export const tiles = style([
  sprinkles({
    gap: tileGap,
    margin: 'none',
    padding: 'none',
  }),
  {
    vars: {
      [tileCount]: '1',
    },
    display: 'grid',
    gridTemplateColumns: `repeat(${tileCount}, 1fr)`,
    '@media': {
      ['screen and (min-width: 500px)']: {
        vars: {
          [tileCount]: '2',
        },
      },
      ['screen and (min-width: 800px)']: {
        vars: {
          [tileCount]: '3',
        },
      },
      ['screen and (min-width: 1200px)']: {
        vars: {
          [tileCount]: '4',
        },
      },
      ['screen and (min-width: 1600px)']: {
        vars: {
          [tileCount]: '5',
        },
      },
    },
  },
]);

const borderColor = colorPaletteVars.border.standard;
const borderRadius = 'medium';
export const tile = style([
  sprinkles({
    position: 'relative',
    borderRadius,
    boxSizing: 'border-box',
  }),
  {
    aspectRatio: '5/4',
    listStyle: 'none',
  },
]);

export const iframe = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    boxSizing: 'border-box',
    border: 0,
  }),
  {
    height: calc('100%').divide(scaleVar).toString(),
    width: calc('100%').divide(scaleVar).toString(),
    borderRadius: calc(vars.radii[borderRadius]).divide(scaleVar).toString(),
    transform: `scale(${scaleVar})`,
    transformOrigin: '0 0',
    // Guard against sub pixel scaling artifacts bleeding into the outer tile
    padding: calc('1px').divide(scaleVar).toString(),
  },
]);

export const titleContainer = style([
  sprinkles({
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    paddingY: 'small',
    paddingX: 'xsmall',
    borderRadius,
  }),
  {
    background: colorPaletteVars.background.selection,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
]);

export const button = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    borderRadius,
    border: 0,
    appearance: 'none',
    padding: 'none',
  }),
  {
    background: 'transparent',
    outline: `1px solid ${borderColor}`,
    selectors: {
      ['&:hover']: {
        outline: `2px solid ${colorPaletteVars.border.accent}`,
      },
      ['&:focus-visible']: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 2,
      },
    },
  },
]);
