import { createVar, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { dark, light } from '../../css/palettes';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const show = style({});

const gutter = vars.space.xsmall;

export const message = style([
  sprinkles({
    transition: 'medium',
    padding: 'xxsmall',
    paddingLeft: 'small',
    borderRadius: 'medium',
    userSelect: 'none',
    display: 'flex',
    gap: 'medium',
    alignItems: 'center',
    boxShadow: 'small',
  }),
  {
    width: 'fit-content',
    maxWidth: '80ex',
    background: colorPaletteVars.background.floating,
    boxShadow: `0 2px 10px -2px ${light.foreground.critical}`,
    wordBreak: 'break-word',
    whiteSpace: 'pre-line',
    outline: `1px solid ${light.foreground.critical}`,
    selectors: {
      [`&:not(${show})`]: {
        transform: `translateY(${gutter})`,
        transition: 'none',
        opacity: 0,
      },
    },
  },
]);

export const delay = createVar();
export const entranceDelay = style({
  transitionDelay: calc(delay).multiply('1ms').toString(),
});

export const button = style([
  sprinkles({
    appearance: 'none',
    borderRadius: 'small',
    font: 'standard',
    fontWeight: 'strong',
    border: 0,
    paddingX: 'small',
    paddingY: 'xxsmall',
    userSelect: 'none',
  }),
  {
    background: light.foreground.critical,
    color: dark.foreground.neutral,
  },
]);
