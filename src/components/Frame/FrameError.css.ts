import { globalStyle, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { light, dark } from '../../css/palettes';

import { sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const show = style({});

const gutter = vars.space.small;
export const message = style([
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
      [`&:not(${show})`]: {
        transform: `translateY(${calc(gutter).negate()})`,
        transition: 'none',
        opacity: 0,
      },
    },
  },
]);

globalStyle(`${message} a`, {
  color: 'inherit',
});

export const delay = style({
  transitionDelay: '1000ms',
});

export const size = {
  small: sprinkles({
    font: 'small',
    padding: 'xsmall',
    borderRadius: 'small',
  }),
  large: sprinkles({
    font: 'large',
    padding: 'medium',
    borderRadius: 'medium',
  }),
};
