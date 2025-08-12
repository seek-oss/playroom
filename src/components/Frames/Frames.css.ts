import { createVar, style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    height: 'full',
    width: 'full',
    boxSizing: 'border-box',
    display: 'flex',
    gap: 'xxxlarge',
    paddingX: 'xxxlarge',
    paddingBottom: 'xxlarge',
    paddingTop: 'medium',
    textAlign: 'center',
    overflow: 'auto',
  }),
  {
    justifyContent: 'safe center',
  },
]);

export const frameWidth = createVar();

export const frameContainer = style([
  sprinkles({
    position: 'relative',
    height: 'full',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  }),
  {
    flexShrink: 0,
    width: frameWidth,
  },
]);

export const frame = style([
  sprinkles({
    border: 0,
    flexGrow: 1,
    width: 'full',
    height: 'full',
    borderRadius: 'medium',
  }),
  {
    outline: `1px solid ${colorPaletteVars.border.standard}`,
    outlineOffset: -1,
  },
]);

export const frameBorder = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    boxShadow: 'small',
    transition: 'medium',
    pointerEvents: 'none',
    borderRadius: 'medium',
  }),
  {
    selectors: {
      [`${frameContainer}:not(:hover) &`]: {
        opacity: 0.8,
      },
    },
  },
]);

const frameNameHeight = '30px';
export const frameName = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    transition: 'medium',
  }),
  {
    flex: `0 0 ${frameNameHeight}`,
    height: frameNameHeight,
    selectors: {
      [`${frameContainer}:not(:hover) &`]: {
        opacity: 0.3,
      },
    },
  },
]);
