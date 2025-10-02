import { style } from '@vanilla-extract/css';

import { minTouchableBeforePseudo } from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

export const root = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'full',
  }),
  {
    background: `radial-gradient(${colorPaletteVars.background.surface} 20%, transparent 50%)`,
  },
]);

export const maxWidth = style([
  sprinkles({ width: 'full', padding: 'medium', boxSizing: 'border-box' }),
  {
    maxWidth: 400,
  },
]);

export const recentTitleSpread = sprinkles({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 'small',
});

export const textButton = style([
  sprinkles({
    position: 'relative',
    border: 0,
    appearance: 'none',
    textAlign: 'left',
    padding: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 'small',
    userSelect: 'none',
  }),
  minTouchableBeforePseudo,
  {
    background: 'transparent',
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 6,
    },
  },
]);
