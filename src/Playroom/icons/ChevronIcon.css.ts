import { style } from '@vanilla-extract/css';
import { vars } from '../vars.css';

export const root = style({
  transition: vars.transition.medium,
  transformOrigin: '50% 50%',
});

export const left = style({
  transform: 'rotate(90deg)',
});

export const up = style({
  transform: 'rotate(180deg)',
});

export const right = style({
  transform: 'rotate(270deg)',
});
