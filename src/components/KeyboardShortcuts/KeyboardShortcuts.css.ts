import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const keyboardShortcutKeys = style([
  {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  sprinkles({
    gap: 'xxsmall',
  }),
]);

export const kbd = style([
  sprinkles({
    borderRadius: 'medium',
    paddingY: 'xxsmall',
    paddingX: 'xsmall',
    textAlign: 'center',
  }),
  {
    display: 'inline-block',
    background: colorPaletteVars.background.neutral,
    fontFamily: 'system-ui',
    minWidth: 16,
  },
]);
