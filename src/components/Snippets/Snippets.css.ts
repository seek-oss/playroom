import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const root = sprinkles({
  position: 'relative',
});

export const fieldContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
  }),
]);

export const snippetsContainer = style([
  sprinkles({
    overflow: 'auto',
    paddingX: 'none',
    margin: 'none',
  }),
  {
    listStyle: 'none',
    height: 300,
  },
]);

export const snippet = style([
  sprinkles({
    position: 'relative',
    display: 'block',
    cursor: 'pointer',
    paddingY: 'small',
    paddingX: 'medium',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    '::before': {
      content: '',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colorPaletteVars.background.selection,
      borderRadius: vars.radii.small,
      opacity: 0,
      pointerEvents: 'none',
    },
  },
]);

export const snippetName = style([
  sprinkles({
    display: 'block',
  }),
  {
    color: colorPaletteVars.foreground.secondary,
  },
]);

export const highlight = style({
  color: colorPaletteVars.foreground.accent,
  '::before': {
    opacity: 1,
  },
});
