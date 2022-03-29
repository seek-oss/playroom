import { calc } from '@vanilla-extract/css-utils';
import { createVar, style } from '@vanilla-extract/css';
import { sprinkles, vars } from './../sprinkles.css';

const size = createVar();

export const root = style([
  sprinkles({
    display: 'flex',
    flexWrap: 'wrap',
  }),
  {
    marginTop: calc(size).negate().toString(),
    marginLeft: calc(size).negate().toString(),
  },
]);

export const item = style({
  paddingTop: size,
  paddingLeft: size,
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
    [size]: calc(vars.grid).multiply(5).toString(),
  },
});

export const xlarge = style({
  vars: {
    [size]: calc(vars.grid).multiply(6).toString(),
  },
});
