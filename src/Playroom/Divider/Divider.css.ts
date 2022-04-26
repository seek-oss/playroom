import { style } from '@vanilla-extract/css';
import { sprinkles, colorPaletteVars } from '../sprinkles.css';

export const root = sprinkles({
  position: 'relative',
});

export const divider = style([
  sprinkles({
    position: 'absolute',
    width: 'full',
  }),
  {
    borderTop: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);
