import { style } from '@vanilla-extract/css';

import { minTouchableBeforePseudo } from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';

const verticalPadding = 'xxxlarge';
export const root = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'full',
    paddingY: verticalPadding,
    boxSizing: 'border-box',
  }),
  {
    background: `radial-gradient(${colorPaletteVars.background.surface} 20%, transparent 50%)`,
    justifyContent: 'safe center',
  },
]);

export const maxWidth = style([
  sprinkles({
    width: 'full',
    // Workaround for scrolling flex container not accounting for padding
    paddingBottom: verticalPadding,
    boxSizing: 'border-box',
  }),
  {
    maxWidth: 520,
  },
]);

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
