import { calc } from '@vanilla-extract/css-utils';
import { style, createVar } from '@vanilla-extract/css';
import { vars } from '../sprinkles.css';

const size = createVar();

export const gap = style({
  selectors: {
    ['&:not(:last-child)']: {
      paddingBottom: size,
    },
  },
});

export const xxsmall = style({
  vars: {
    [size]: vars.grid,
  },
});

export const xsmall = style({
  vars: {
    [size]: calc(vars.grid).multiply(2).toString(),
  },
});

export const small = style({
  vars: {
    [size]: calc(vars.grid).multiply(3).toString(),
  },
});

export const medium = style({
  vars: {
    [size]: calc(vars.grid).multiply(4).toString(),
  },
});

export const large = style({
  vars: {
    [size]: calc(vars.grid).multiply(6).toString(),
  },
});

export const xlarge = style({
  vars: {
    [size]: calc(vars.grid).multiply(12).toString(),
  },
});
