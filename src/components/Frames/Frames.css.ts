import { createVar, style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

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
  }),
  {
    flexShrink: 0,
    width: frameWidth,
  },
]);

export const highlightOnHover = style({
  transition: `color ${transitionTiming}`,
  selectors: {
    [`${frameContainer}:hover &, ${frameContainer}:focus-within &, ${frameActive} &`]:
      {
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
  },
]);

export const frameHeadingContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 'xxsmall',
    paddingBottom: 'small',
  }),
  {
    transition: `opacity ${transitionTiming}`,
    selectors: {
      [`${frameContainer}:not(:hover, :focus-within, ${frameActive}) &`]: {
        opacity: 1,
      },
    },
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
    background: '#fff',
    outline: '1px solid transparent',
    transition: `outline-color ${transitionTiming}, opacity ${transitionTiming}`,
    selectors: {
      [comma(
        `${frameHeadingContainer}:hover ~ ${frameWrapper} &`,
        `${frameHeadingContainer}:focus-within ~ ${frameWrapper}&`
      )]: {
        outlineColor: `${colorPaletteVars.foreground.accent}`,
      },
    },
  },
]);

export const frameActionsContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'xsmall',
  }),
  {
    transition: `opacity ${transitionTiming}`,
    selectors: {
      [`${frameContainer}:not(:hover, :focus-within, ${frameActive}) &`]: {
        opacity: 0,
      },
    },
  },
]);
