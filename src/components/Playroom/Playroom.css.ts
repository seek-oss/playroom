import {
  style,
  globalStyle,
  createVar,
  fallbackVar,
  styleVariants,
} from '@vanilla-extract/css';

import { space, comma, newline } from '../../css/delimiters';
import { toolbarItemCount, toolbarOpenSize } from '../constants';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';

const MIN_HEIGHT = `${toolbarItemSize * toolbarItemCount}px`;
const MIN_WIDTH = `${toolbarOpenSize + toolbarItemSize + 80}px`;

const MAX_HEIGHT = '80vh';
const MAX_WIDTH = '90vw';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  backgroundColor: colorPaletteVars.background.body,
});

globalStyle('html[data-playroom-dark]', {
  colorScheme: 'dark',
});

export const resizing = style({
  pointerEvents: 'none',
  userSelect: 'none',
});

const bottomEditorHeight = createVar();
const rightEditorWidth = createVar();
export const editorSize = createVar();
export const assistantWidth = createVar();
export const root = style([
  sprinkles({
    height: 'viewport',
    width: 'viewport',
  }),
  {
    display: 'grid',
    gridTemplateColumns: space('1fr', fallbackVar(rightEditorWidth, '0px')),
    gridTemplateRows: space('auto', fallbackVar(bottomEditorHeight, '0px')),
    willChange: comma('grid-template-columns', 'grid-template-rows'),
  },
]);

export const toggleEditorDuration = 300;
export const editorTransition = style({
  transition: comma(
    `grid-template-columns ${toggleEditorDuration}ms ease`,
    `grid-template-rows ${toggleEditorDuration}ms ease`
  ),
});

export const editorPosition = styleVariants({
  bottom: [
    {
      vars: {
        [bottomEditorHeight]: `clamp(${MIN_HEIGHT}, ${editorSize}, ${MAX_HEIGHT})`,
      },
      gridTemplateAreas: newline('"frames frames"', '"editor editor"'),
    },
  ],
  right: [
    {
      vars: {
        [rightEditorWidth]: `clamp(${MIN_WIDTH}, ${editorSize}, ${MAX_WIDTH})`,
      },
      gridTemplateAreas: newline('"frames editor"', '"frames editor"'),
    },
  ],
});

export const frames = style({
  gridArea: 'frames',
});

export const editor = style([
  {
    gridArea: 'editor',
  },
  sprinkles({
    overflow: 'hidden',
    boxShadow: 'small',
  }),
]);

export const toggleEditorContainer = style([
  sprinkles({
    position: 'absolute',
    bottom: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
  }),
  {
    selectors: {
      [`${editorPosition.bottom} &`]: {
        width: toolbarItemSize,
      },
    },
  },
]);

export const toggleEditorButton = style([
  sprinkles({
    position: 'relative',
    borderRadius: 'large',
    padding: 'none',
    cursor: 'pointer',
    width: 'full',
    appearance: 'none',
    border: 0,
  }),
  {
    background: 'transparent',
    WebkitTapHighlightColor: 'transparent',
    outline: 'none',
    minWidth: vars.touchableSize,
    height: vars.touchableSize,
    selectors: {
      [`&:not(:hover):not(:focus)`]: {
        opacity: 0.3,
      },
      [`&:hover::before, &:focus::before`]: {
        opacity: 0.05,
      },
    },
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'currentColor',
      opacity: 0,
      pointerEvents: 'none',
      borderRadius: vars.radii.large,
      transition: vars.transition.slow,
    },
  },
]);

export const framesContainer = sprinkles({
  position: 'absolute',
  inset: 0,
});

export const editorContainer = sprinkles({
  position: 'absolute',
  inset: 0,
});

export const toolbarContainer = sprinkles({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
});
