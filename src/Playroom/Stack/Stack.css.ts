import { style, createVar, styleVariants } from '@vanilla-extract/css';
import { vars } from '../sprinkles.css';

const size = createVar();

export const gap = style({
  selectors: {
    ['&:not(:last-child)']: {
      paddingBottom: size,
    },
  },
});

export const spaceScale = styleVariants(vars.space, (space) => ({
  vars: {
    [size]: space,
  },
}));
