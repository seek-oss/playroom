import { style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { toolbarOpenSize } from '../constants';

import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';
import { sprinkles, colorPaletteVars } from '../sprinkles.css';

const toolbarBorderThickness = '1px';

export const root = style({
  color: colorPaletteVars.foreground.neutral,
  minWidth: calc(`${toolbarItemSize}px`).add(toolbarBorderThickness).toString(),
});

export const shadow = style({
  zIndex: -1,
});

export const backdrop = style([
  sprinkles({
    position: 'absolute',
    height: 'viewport',
    width: 'viewport',
  }),
]);

export const sidebar = sprinkles({
  position: 'absolute',
  display: 'flex',
  pointerEvents: 'none',
  height: 'full',
  overflow: 'hidden',
});

export const buttons = style({
  width: toolbarItemSize,
  backgroundColor: colorPaletteVars.background.surface,
  borderRight: `${toolbarBorderThickness} solid ${colorPaletteVars.border.standard}`,
});

export const panel = style([
  sprinkles({
    position: 'relative',
    overflow: 'auto',
    pointerEvents: 'auto',
  }),
  {
    width: toolbarOpenSize,
    backgroundColor: colorPaletteVars.background.surface,
    borderRight: `${toolbarBorderThickness} solid ${colorPaletteVars.border.standard}`,
  },
]);

const panelTransitionOffset = '-30%';

export const transitionStyles = {
  enter: style({
    opacity: 0,
    transform: `translateX(${panelTransitionOffset})`,
  }),
  enterActive: style([
    sprinkles({
      transition: 'slow',
    }),
    {
      opacity: 1,
      transform: `translateX(0)`,
    },
  ]),
  enterDone: style({
    opacity: 1,
    transform: `translateX(0)`,
  }),
  exit: style({
    opacity: 1,
  }),
  exitActive: style([
    sprinkles({
      transition: 'slow',
    }),
    {
      opacity: 0,
      transform: `translateX(${panelTransitionOffset})`,
    },
  ]),
  exitDone: style({
    opacity: 0,
    transform: `translateX(${panelTransitionOffset})`,
  }),
};
