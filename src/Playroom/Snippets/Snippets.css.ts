import { style } from '@vanilla-extract/css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';
import { sprinkles, vars, colorPaletteVars } from '../sprinkles.css';

export const root = sprinkles({
  position: 'relative',
  overflow: 'hidden',
  height: 'full',
});

export const fieldContainer = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    paddingX: 'medium',
  }),
  {
    height: toolbarItemSize,
    boxShadow: `inset 0 -1px 0 0 ${colorPaletteVars.border.standard}`,
  },
]);

export const snippetsContainer = style([
  sprinkles({
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'auto',
    padding: 'none',
    margin: 'medium',
  }),
  {
    top: toolbarItemSize,
  },
]);

export const snippet = style([
  sprinkles({
    position: 'relative',
    cursor: 'pointer',
    paddingY: 'large',
    paddingX: 'xlarge',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    backgroundColor: colorPaletteVars.background.surface,
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colorPaletteVars.background.selection,
      borderRadius: vars.radii.medium,
      opacity: 0,
      transition: vars.transition.slow,
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
