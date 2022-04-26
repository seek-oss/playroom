import { calc } from '@vanilla-extract/css-utils';
import { style } from '@vanilla-extract/css';
import { sprinkles, colorPaletteVars } from '../sprinkles.css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';

export const toolbarOpenSize = 300;
const toolbarBorderThickness = '1px';

export const isOpen = style({});
export const root = style([
  sprinkles({
    position: 'relative',
    height: 'full',
    display: 'flex',
    flexDirection: 'row-reverse',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    minWidth: calc(`${toolbarItemSize}px`)
      .add(toolbarBorderThickness)
      .toString(),
    selectors: {
      [`&${isOpen}`]: {
        width: '100vw',
      },
    },
  },
]);

export const backdrop = sprinkles({
  position: 'absolute',
  height: 'viewport',
  width: 'viewport',
});

export const sidebar = sprinkles({
  position: 'absolute',
  display: 'flex',
  pointerEvents: 'none',
  height: 'full',
  flexDirection: 'row-reverse',
  overflow: 'hidden',
});

export const topButtons = sprinkles({
  transition: 'medium',
});

export const positions_isOpen = style({});
export const positionContainer = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    width: 'full',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    transition: 'medium',
  }),
  {
    bottom: toolbarItemSize,
    selectors: {
      [`&:not(${positions_isOpen})`]: {
        opacity: 0,
        pointerEvents: 'none',
        transform: 'translateY(20px)',
      },
    },
  },
]);

export const buttons = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'auto',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1,
  }),
  {
    width: toolbarItemSize,
    backgroundColor: colorPaletteVars.background.surface,
    borderLeft: `${toolbarBorderThickness} solid ${colorPaletteVars.border.standard}`,
  },
]);

export const panel = style([
  sprinkles({
    position: 'relative',
    display: 'flex',
    overflow: 'auto',
    transition: 'slow',
    pointerEvents: 'auto',
  }),
  {
    width: toolbarOpenSize,
    backgroundColor: colorPaletteVars.background.surface,
    borderLeft: `${toolbarBorderThickness} solid ${colorPaletteVars.border.standard}`,
    selectors: {
      [`${root}:not(${isOpen}) &`]: {
        transform: `translateX(${calc(`${toolbarOpenSize}px`).multiply(0.3)})`,
        opacity: 0,
        pointerEvents: 'none',
      },
    },
  },
]);

export const preference = sprinkles({
  position: 'absolute',
  inset: 0,
});
