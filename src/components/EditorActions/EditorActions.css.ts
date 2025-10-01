import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    display: 'flex',
    gap: 'xsmall',
    padding: 'xxsmall',
    borderRadius: 'medium',
    boxShadow: 'small',
  }),
  {
    backgroundColor: colorPaletteVars.background.floating,
    outline: `1px solid ${colorPaletteVars.border.standard}`,
  },
]);

export const syntaxErrorsContainer = sprinkles({ padding: 'xsmall' });

export const button = style([
  sprinkles({
    padding: 'xsmall',
    borderRadius: 'small',
    display: 'flex',
    alignItems: 'center',
    gap: 'xsmall',
    border: 0,
  }),
  {
    background: 'transparent',
    color: colorPaletteVars.foreground.neutral,
    ':hover': {
      backgroundColor: colorPaletteVars.background.selection,
    },
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 2,
    },
  },
]);

export const snippetsPopupWidth = style({
  width: 'min(300px, 90vw)',
});
