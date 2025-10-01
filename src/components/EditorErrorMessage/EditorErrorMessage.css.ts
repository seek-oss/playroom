import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    padding: 'small',
    borderRadius: 'medium',
  }),
  {
    width: 'fit-content',
    backgroundColor: colorPaletteVars.background.critical,
  },
]);
