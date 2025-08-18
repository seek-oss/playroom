import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    paddingX: 'xlarge',
    paddingY: 'small',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),
  {
    backgroundColor: colorPaletteVars.background.surface,
  },
]);
