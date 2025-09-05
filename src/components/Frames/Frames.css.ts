import { createVar, style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    height: 'full',
    width: 'full',
    boxSizing: 'border-box',
    display: 'flex',
    gap: 'xxlarge',
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
    borderRadius: 'medium',
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
    borderRadius: 'medium',
  }),
  {
    isolation: 'isolate',
    background: colorPaletteVars.background.surface,
  },
]);

export const frameBorder = style([
  sprinkles({
    position: 'absolute',
    inset: 0,
    transition: 'medium',
    pointerEvents: 'none',
    borderRadius: 'medium',
  }),
  {
    outline: `2px solid ${colorPaletteVars.border.accent}`,
    selectors: {
      [`${frameContainer}:not(:hover, ${frameActive}) &`]: {
        opacity: 0,
        transform: 'scale(0.95)',
      },
    },
  },
]);

export const frameHeadingContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'medium',
    paddingRight: 'xxsmall',
  }),
  {
    selectors: {
      [`${frameContainer}:not(:hover, ${frameActive}) &`]: {
        opacity: 0.4,
      },
    },
  },
]);

export const frameActionsContainer = style([
  sprinkles({
    transition: 'medium',
    display: 'flex',
    alignItems: 'center',
    gap: 'small',
  }),
  {
    transitionDelay: '300ms',
    selectors: {
      [`${frameContainer}:not(:hover, ${frameActive}) &`]: {
        transitionDelay: '0ms',
        opacity: 0,
        transform: 'translateY(15%)',
      },
    },
  },
]);
