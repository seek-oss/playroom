import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';
import { dialogScrollContentGutter } from '../Header/Header.css';

const outlineSize = '2px';

export const scaleVar = createVar();

export const container = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    padding: dialogScrollContentGutter,
  }),
  {
    flex: 1,
    minHeight: 0,
  },
]);

const gridItemCount = createVar();
const gridGap = 'medium';
export const grid = style([
  sprinkles({
    gap: gridGap,
    margin: 'none',
  }),
  {
    padding: outlineSize,
    vars: {
      [gridItemCount]: '1',
    },
    display: 'grid',
    gridTemplateColumns: `repeat(${gridItemCount}, 1fr)`,
    '@media': {
      ['screen and (min-width: 500px)']: {
        vars: {
          [gridItemCount]: '2',
        },
      },
      ['screen and (min-width: 800px)']: {
        vars: {
          [gridItemCount]: '3',
        },
      },
      ['screen and (min-width: 1200px)']: {
        vars: {
          [gridItemCount]: '4',
        },
      },
      ['screen and (min-width: 1600px)']: {
        vars: {
          [gridItemCount]: '5',
        },
      },
    },
  },
]);

const borderColor = colorPaletteVars.border.standard;
const borderRadius = 'medium';

export const gridItem = style([
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

export const gridItemIframe = style([
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

export const gridItemTitle = style([
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

export const gridItemButton = style([
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
        outline: `${outlineSize} solid ${colorPaletteVars.border.accent}`,
      },
      ['&:focus-visible']: {
        outline: `${outlineSize} solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: 2,
      },
    },
  },
]);

export const list = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    margin: 'none',
    gap: 'small',
    padding: 'xxxsmall',
  }),
]);

export const listItem = style([
  sprinkles({
    position: 'relative',
    borderRadius,
    boxSizing: 'border-box',
  }),
  {
    listStyle: 'none',
  },
]);

export const listItemButton = style([
  sprinkles({
    borderRadius,
    border: 0,
    appearance: 'none',
    padding: 'medium',
    boxSizing: 'border-box',
  }),
  {
    width: '100%',
    textAlign: 'left',
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
