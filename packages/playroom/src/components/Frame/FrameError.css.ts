import { globalStyle, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { light, dark } from '../../css/palettes';

import { sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const show = style({});

const gutter = vars.space.xsmall;
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
    background: light.foreground.critical,
    boxShadow: `0 2px 10px -2px ${light.foreground.critical}`,
    wordBreak: 'break-word',
    whiteSpace: 'pre-line',
    userSelect: 'all',
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
    padding: 'xsmall',
    borderRadius: 'small',
  }),
  large: sprinkles({
    padding: 'medium',
    borderRadius: 'medium',
  }),
};

export const invertText = style({
  color: dark.foreground.neutral,
});
