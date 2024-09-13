import { style } from '@vanilla-extract/css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';
import { sprinkles, colorPaletteVars } from '../sprinkles.css';
import { vars } from '../vars.css';

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
    paddingX: 'small',
  }),
  {
    height: toolbarItemSize,
    boxShadow: `inset 0 -1px 0 0 ${colorPaletteVars.border.standard}`,
  },
]);

const snippetsBorderSpace = 'small';

export const snippetsContainer = style([
  sprinkles({
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    overflow: 'auto',
    paddingX: 'none',
    paddingY: snippetsBorderSpace,
    margin: 'none',
  }),
  {
    listStyle: 'none',
    top: toolbarItemSize,
    /*
      These pseudo-elements create a buffer area at the top and bottom of the list, the same size as the scroll margin.
      This prevents auto-scrolling when the cursor enters a snippet in the scroll margin, by preventing the element from being selected.
    */
    '::before': {
      content: '',
      position: 'fixed',
      top: toolbarItemSize,
      left: 0,
      right: 0,
      height: vars.space[snippetsBorderSpace],
      zIndex: 1,
    },
    '::after': {
      content: '',
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: vars.space[snippetsBorderSpace],
      zIndex: 1,
    },
  },
]);

export const snippet = style([
  sprinkles({
    position: 'relative',
    display: 'block',
    cursor: 'pointer',
    paddingY: 'large',
    paddingX: 'xlarge',
    marginX: snippetsBorderSpace,
  }),
  {
    scrollMarginBlock: vars.space[snippetsBorderSpace],
    color: colorPaletteVars.foreground.neutral,
    backgroundColor: colorPaletteVars.background.surface,
    '::before': {
      content: '',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colorPaletteVars.background.selection,
      borderRadius: vars.radii.medium,
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
