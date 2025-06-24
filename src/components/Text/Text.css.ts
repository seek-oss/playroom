import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const base = sprinkles({
  display: 'block',
});

export const neutral = style({
  color: colorPaletteVars.foreground.neutral,
});

export const critical = style({
  color: colorPaletteVars.foreground.critical,
});

export const secondary = style({
  color: colorPaletteVars.foreground.secondary,
});

export const xsmall = sprinkles({
  font: 'xsmall',
});

export const small = sprinkles({
  font: 'small',
});

export const standard = sprinkles({
  font: 'standard',
});

export const large = sprinkles({
  font: 'large',
});

export const strong = sprinkles({
  fontWeight: 'strong',
});

export const truncate = style([
  sprinkles({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
  {
    textOverflow: 'ellipsis',
  },
]);
