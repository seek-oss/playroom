import {
  createVar,
  fallbackVar,
  style,
  styleVariants,
} from '@vanilla-extract/css';

import { sprinkles } from '../../css/sprinkles.css';

export const container = style([
  sprinkles({
    position: 'relative',
    height: 'full',
  }),
  {
    WebkitOverflowScrolling: 'touch',
    WebkitMaskComposite: 'destination-in', // Fallback for browsers that don't support mask-composite
    maskComposite: 'intersect',
  },
]);

export const hideScrollbar = style({
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '::-webkit-scrollbar': {
    width: 0,
    height: 0,
  },
});

const scrollOverlaySize = createVar();
export const fadeSize = styleVariants({
  small: {
    vars: {
      [scrollOverlaySize]: '30px',
    },
  },
  medium: {
    vars: {
      [scrollOverlaySize]: '45px',
    },
  },
  large: {
    vars: {
      [scrollOverlaySize]: '60px',
    },
  },
});

export const direction = styleVariants({
  horizontal: {
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  vertical: {
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  all: {
    overflow: 'auto',
  },
});

const left = createVar();
const right = createVar();
const top = createVar();
const bottom = createVar();
export const mask = style({
  maskImage: [
    `linear-gradient(to bottom, transparent 0, black ${fallbackVar(top, '0')})`,
    `linear-gradient(to right, transparent 0, black ${fallbackVar(left, '0')})`,
    `linear-gradient(to left, transparent 0, black ${fallbackVar(right, '0')})`,
    `linear-gradient(to top, transparent 0, black ${fallbackVar(bottom, '0')})`,
  ].join(','),
});

export const maskLeft = style({
  vars: {
    [left]: scrollOverlaySize,
  },
});

export const maskRight = style({
  vars: {
    [right]: scrollOverlaySize,
  },
});

export const maskTop = style({
  vars: {
    [top]: scrollOverlaySize,
  },
});

export const maskBottom = style({
  vars: {
    [bottom]: scrollOverlaySize,
  },
});
