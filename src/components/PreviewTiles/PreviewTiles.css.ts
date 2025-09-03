import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { comma } from '../../css/delimiters';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

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
    border: `2px solid ${borderColor}`,
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
    transform: `scale(${scaleVar})`,
    transformOrigin: '0 0',
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
  }),
  {
    background: borderColor,
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
    selectors: {
      [comma('&:hover', '&:focus-visible')]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
      },
    },
  },
]);
