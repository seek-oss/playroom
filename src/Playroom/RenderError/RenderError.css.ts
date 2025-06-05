import { globalStyle, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { light, dark } from '../palettes';

import { sprinkles } from '../sprinkles.css';
import { vars } from '../vars.css';

export const showError = style({});

const gutter = vars.space.medium;
export const errorMessage = style([
  sprinkles({
    position: 'absolute',
    fontWeight: 'strong',
    transition: 'medium',
  }),
  {
    top: gutter,
    left: gutter,
    right: gutter,
    marginInline: 'auto',
    width: 'fit-content',
    maxWidth: '80ex',
    color: dark.foreground.neutral,
    background: light.foreground.critical,
    boxShadow: `0 2px 10px -2px ${light.foreground.critical}`,
    wordBreak: 'break-word',
    whiteSpace: 'pre-line',
    selectors: {
      [`&:not(${showError})`]: {
        transform: `translateY(${calc(gutter).negate()})`,
        transition: 'none',
        opacity: 0,
      },
    },
  },
]);

globalStyle(`${errorMessage} a`, {
  color: 'inherit',
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
