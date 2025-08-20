import {
  style,
  globalStyle,
  createVar,
  fallbackVar,
  styleVariants,
} from '@vanilla-extract/css';

import { space, comma, newline } from '../../css/delimiters';
import {
  ANIMATION_DURATION_SLOW,
  toolbarItemCount,
  toolbarOpenSize,
} from '../constants';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { toolbarItemSize } from '../ToolbarItem/ToolbarItem.css';

const MIN_HEIGHT = `${toolbarItemSize * toolbarItemCount}px`;
const MIN_WIDTH = `${toolbarOpenSize + toolbarItemSize + 80}px`;

const MAX_HEIGHT = '70vh';
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
    gridTemplateRows: space(
      'min-content',
      'auto',
      fallbackVar(bottomEditorHeight, '0px')
    ),
    willChange: comma('grid-template-columns', 'grid-template-rows'),
    isolation: 'isolate',
  },
]);

export const editorTransition = style({
  transition: comma(
    `grid-template-columns ${ANIMATION_DURATION_SLOW}ms ease`,
    `grid-template-rows ${ANIMATION_DURATION_SLOW}ms ease`
  ),
});

export const editorPosition = styleVariants({
  bottom: [
    {
      vars: {
        [bottomEditorHeight]: `clamp(${MIN_HEIGHT}, ${editorSize}, ${MAX_HEIGHT})`,
      },
      gridTemplateAreas: newline(
        '"header header"',
        '"frames frames"',
        '"editor editor"'
      ),
    },
  ],
  right: [
    {
      vars: {
        [rightEditorWidth]: `clamp(${MIN_WIDTH}, ${editorSize}, ${MAX_WIDTH})`,
      },
      gridTemplateAreas: newline(
        '"header header"',
        '"frames editor"',
        '"frames editor"'
      ),
    },
  ],
});

export const header = style({
  gridArea: 'header',
  zIndex: 1,
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
