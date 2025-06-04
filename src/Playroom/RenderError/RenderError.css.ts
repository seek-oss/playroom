import {
  createVar,
  fallbackVar,
  globalStyle,
  style,
} from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { light, dark } from '../palettes';

import { sprinkles } from '../sprinkles.css';
import { vars } from '../vars.css';

export const showError = style({});

const entranceOffset = createVar();

const halfWidth = '50%';
const gutter = 'medium';
export const errorMessage = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    fontWeight: 'strong',
    marginTop: gutter,
    pointerEvents: 'none',
    transition: 'medium',
  }),
  {
    zIndex: 1000,
    color: dark.foreground.neutral,
    background: light.foreground.critical,
    boxShadow: `0 2px 10px -2px ${light.foreground.critical}`,
    transform: `translate(${calc(halfWidth).negate()}, ${fallbackVar(
      entranceOffset,
      '0'
    )})`,
    left: halfWidth,
    wordBreak: 'break-word',
    whiteSpace: 'pre-line',
    maxWidth: '80ex',
    marginRight: calc(halfWidth)
      .negate()
      .add(calc(vars.space[gutter]).multiply(2))
      .toString(),
    selectors: {
      [`&:not(${showError})`]: {
        vars: {
          [entranceOffset]: calc(vars.space[gutter]).negate().toString(),
        },
        opacity: 0,
        transitionDelay: '0ms',
        transition: 'none',
      },
    },
  },
]);

globalStyle(`${errorMessage} a`, {
  color: 'inherit',
  pointerEvents: 'auto',
});

export const delay = style({
  transitionDelay: '1000ms',
});

export const size = {
  small: sprinkles({
    font: 'small',
    padding: 'medium',
    borderRadius: 'medium',
  }),
  large: sprinkles({
    font: 'large',
    padding: 'xlarge',
    borderRadius: 'large',
  }),
};
