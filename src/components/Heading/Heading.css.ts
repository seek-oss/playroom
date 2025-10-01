import plusJakartaSansMetrics from '@capsizecss/metrics/plusJakartaSans';
import { createTextStyle } from '@capsizecss/vanilla-extract';
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

export const level1 = createTextStyle({
  fontSize: 36,
  leading: 44,
  fontMetrics: plusJakartaSansMetrics,
});

export const level2 = createTextStyle({
  fontSize: 24,
  leading: 30,
  fontMetrics: plusJakartaSansMetrics,
});

export const level3 = createTextStyle({
  fontSize: 16,
  leading: 20,
  fontMetrics: plusJakartaSansMetrics,
});
