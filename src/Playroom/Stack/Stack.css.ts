import { style, createVar, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../css/vars.css';

const size = createVar();

export const gap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: size,
});

export const spaceScale = styleVariants(vars.space, (space) => ({
  vars: {
    [size]: space,
  },
}));
