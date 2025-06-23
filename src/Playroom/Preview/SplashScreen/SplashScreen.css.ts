import { style, globalStyle, keyframes } from '@vanilla-extract/css';

import { dark } from '../../../css/palettes';

import { sprinkles, colorPaletteVars } from '../../../css/sprinkles.css';

export const animationDuration = 1300;
export const animationDelay = 500;
export const animationIterationCount = 2;

export const root = style([
  sprinkles({
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    transition: 'slow',
  }),
  {
    /**
     * Attempt to elevate above portal'd elements that are
     * attached to the `body` element.
     */
    zIndex: 99999,
    background: dark.background.neutral,
    color: colorPaletteVars.foreground.neutralInverted,
  },
]);

export const hideSplash = sprinkles({
  opacity: 0,
  pointerEvents: 'none',
});

export const trace = style({});
const traceKeyframes = keyframes({
  '0%, 100%': {
    opacity: 0,
  },
  '20%, 80%': {
    opacity: 1,
  },
  '50%, 100%': {
    strokeDashoffset: 0,
  },
});
globalStyle(`${trace} > svg > path`, {
  strokeDasharray: 1000,
  strokeDashoffset: 1000,
  animationName: traceKeyframes,
  animationDuration: `${animationDuration}ms`,
  animationDelay: `${animationDelay}ms`,
  animationDirection: 'forwards',
  animationTimingFunction: 'ease-in',
  animationIterationCount,
  animationFillMode: 'forwards',
});

export const size = style({
  margin: '0 auto',
  width: '40vw',
  maxWidth: '200px',
});
