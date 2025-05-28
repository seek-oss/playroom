import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { light, dark } from '../palettes';

import { rawValues } from '../vars.css';

export const showError = style({});

const entranceOffset = createVar();

const halfWidth = '50%';
const gutter = rawValues.space.medium;
export const errorMessage = style({
  position: 'fixed',
  top: 0,
  zIndex: 1000,
  font: rawValues.font.scale.small,
  fontWeight: rawValues.font.weight.strong,
  color: dark.foreground.neutral,
  background: light.foreground.critical,
  borderRadius: rawValues.radii.medium,
  padding: rawValues.space.medium,
  marginTop: gutter,
  boxShadow: `0 2px 10px -2px ${light.foreground.critical}`,
  transform: `translate(${calc(halfWidth).negate()}, ${fallbackVar(
    entranceOffset,
    '0'
  )})`,
  left: halfWidth,
  marginRight: calc(halfWidth)
    .negate()
    .add(calc(gutter).multiply(2))
    .toString(),
  transition: rawValues.transition.medium,
  pointerEvents: 'none',
  transitionDelay: '1000ms',
  selectors: {
    [`&:not(${showError})`]: {
      vars: {
        [entranceOffset]: '-20px',
      },
      opacity: 0,
      transitionDelay: '0ms',
    },
  },
});
