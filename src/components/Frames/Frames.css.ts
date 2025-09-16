import { createVar, style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

const transitionTiming = '150ms ease';

export const root = style([
  sprinkles({
    height: 'full',
    width: 'full',
    boxSizing: 'border-box',
    display: 'flex',
    gap: 'medium',
    paddingY: 'xxlarge',
    paddingX: 'xlarge',
    textAlign: 'center',
    overflow: 'auto',
  }),
  {
    justifyContent: 'safe center',
  },
]);

export const frameWidth = createVar();

export const frameActive = style({});

export const frameContainer = style([
  sprinkles({
    position: 'relative',
    height: 'full',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: 'small',
  }),
  {
    flexShrink: 0,
    width: frameWidth,
  },
]);

export const highlightOnHover = style({
  transition: `color ${transitionTiming}`,
  selectors: {
    [`${frameContainer}:hover &, ${frameActive} &`]: {
      color: `${colorPaletteVars.foreground.accent}`,
    },
  },
});

export const frameWrapper = style([
  sprinkles({
    position: 'relative',
    height: 'full',
  }),
  {
    border: `1px solid ${colorPaletteVars.border.standard}`,
    background: colorPaletteVars.background.surface,
  },
]);

export const frame = style([
  sprinkles({
    border: 0,
    flexGrow: 1,
    width: 'full',
    height: 'full',
  }),
  {
    isolation: 'isolate',
    background: colorPaletteVars.background.surface,
    outline: '2px solid transparent',
    transition: `outline-color ${transitionTiming}, opacity ${transitionTiming}`,
    selectors: {
      [`${frameContainer}:hover &, ${frameActive} &`]: {
        outlineColor: `${colorPaletteVars.border.accent}`,
      },
    },
  },
]);

export const frameHeadingContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 'xxsmall',
  }),
  {
    transition: `opacity ${transitionTiming}`,
    selectors: {
      [`${frameContainer}:not(:hover, ${frameActive}) &`]: {
        opacity: 0.4,
      },
    },
  },
]);

export const frameActionsContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'small',
  }),
  {
    transition: `opacity ${transitionTiming}`,
    selectors: {
      [`${frameContainer}:not(:hover, ${frameActive}) &`]: {
        opacity: 0,
      },
    },
  },
]);
