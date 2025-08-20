import { style } from '@vanilla-extract/css';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';

export const root = sprinkles({
  position: 'relative',
});

export const fieldContainer = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
  }),
]);

const snippetsBorderSpace = 'xxsmall';

export const snippetsContainer = style([
  sprinkles({
    overflow: 'auto',
    paddingX: 'none',
    paddingY: snippetsBorderSpace,
    margin: 'none',
  }),
  {
    listStyle: 'none',
    height: 300,
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
    paddingY: 'small',
    paddingX: 'medium',
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
