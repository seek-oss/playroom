import { style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    paddingX: 'xlarge',
    paddingY: 'small',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
  {
    backgroundColor: colorPaletteVars.background.surface,
  },
]);

export const menuButton = style([
  {
    color: colorPaletteVars.foreground.neutral,
    selectors: {
      [comma(
        '*:hover > &',
        '*:active > &',
        '*:focus-visible > &',
        '*[data-popup-open] > &'
      )]: {
        color: colorPaletteVars.foreground.accent,
      },
    },
  },
]);
