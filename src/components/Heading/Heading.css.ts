import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const base = style([
  sprinkles({
    margin: 'none',
    fontWeight: 'strong',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    fontFamily: vars.font.family.standard,
  },
]);

export const level1 = style({
  fontSize: '36px',
});
export const level2 = style({
  fontSize: '24px',
});
export const level3 = style({
  fontSize: '16px',
});
