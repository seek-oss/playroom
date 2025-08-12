import { style } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

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
    paddingY: 'xsmall',
    paddingX: 'small',
    textAlign: 'center',
  }),
  {
    display: 'inline-block',
    background: colorPaletteVars.background.neutral,
    fontFamily: 'system-ui',
    minWidth: 16,
  },
]);
