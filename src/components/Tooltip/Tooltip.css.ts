import { style } from '@vanilla-extract/css';

import { sharedPopupStyles } from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const popup = style([
  sharedPopupStyles,
  sprinkles({ padding: 'xsmall', borderRadius: 'medium' }),
  {
    backgroundColor: colorPaletteVars.background.tooltip,
    vars: {
      [colorPaletteVars.foreground.neutral]:
        colorPaletteVars.foreground.tooltip,
    },
  },
]);
