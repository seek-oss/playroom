import { style, createVar, styleVariants } from '@vanilla-extract/css';
import { vars } from '../sprinkles.css';

const size = createVar();

export const gap = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: size,
});

export const spaceScale = styleVariants(vars.space, (space) => ({
  vars: {
    [size]: space,
  },
}));
