import { style, createVar, styleVariants } from '@vanilla-extract/css';

import { vars } from '../../css/vars.css';

const size = createVar();
const horizontalAlignment = createVar();

export const gap = style({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: size,
  alignItems: horizontalAlignment,
});

export const spaceScale = styleVariants(vars.space, (space) => ({
  vars: {
    [size]: space,
  },
}));

export const horizontalAlignmentScale = styleVariants(
  {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  },
  (alignment) => ({
    alignItems: alignment,
  })
);
