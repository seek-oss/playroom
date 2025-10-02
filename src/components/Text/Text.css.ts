import plusJakartaSansMetrics from '@capsizecss/metrics/plusJakartaSans';
import { createTextStyle } from '@capsizecss/vanilla-extract';
import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { fontSizeDefinitions, vars } from '../../css/vars.css';

export const base = style([
  sprinkles({
    display: 'block',
    margin: 'none',
    fontWeight: 'normal',
  }),
  {
    fontFamily: vars.font.family.standard,
  },
]);

export const size = Object.fromEntries(
  Object.entries(fontSizeDefinitions).map(([name, [fontSize, leading]]) => [
    name,
    createTextStyle(
      {
        fontSize,
        leading,
        fontMetrics: plusJakartaSansMetrics,
      },
      name
    ),
  ])
);

export const neutral = style({
  color: colorPaletteVars.foreground.neutral,
});

export const critical = style({
  color: colorPaletteVars.foreground.critical,
});

export const secondary = style({
  color: colorPaletteVars.foreground.secondary,
});

export const positive = style({
  color: colorPaletteVars.foreground.positive,
});

export const strong = sprinkles({
  fontWeight: 'strong',
});

export const underline = style({
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
});

export const truncate = style([
  sprinkles({
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }),
  {
    textOverflow: 'ellipsis',
  },
]);
