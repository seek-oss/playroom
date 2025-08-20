import { style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    paddingX: 'xlarge',
    paddingY: 'small',
  }),
  {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorPaletteVars.background.surface,
  },
]);

export const menuContainer = style({
  width: 'fit-content',
});

export const actionsContainer = style({
  width: 'fit-content',
  justifySelf: 'flex-end',
});

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
