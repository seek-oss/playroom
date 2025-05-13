import {
  style,
  globalStyle,
  styleVariants,
  createVar,
} from '@vanilla-extract/css';
import { sprinkles, colorPaletteVars } from './sprinkles.css';
import { vars } from './vars.css';
import { toolbarItemSize } from './ToolbarItem/ToolbarItem.css';
import {
  ANIMATION_TIMEOUT,
  toolbarItemCount,
  toolbarOpenSize,
} from './constants';

export const MIN_HEIGHT = toolbarItemSize * toolbarItemCount;
export const MIN_WIDTH = toolbarOpenSize + toolbarItemSize + 80;

const MAX_HEIGHT = '80vh';
const MAX_WIDTH = '90vw';

globalStyle('html', {
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: colorPaletteVars.background.body,
});

globalStyle('html[data-playroom-dark]', {
  colorScheme: 'dark',
});

globalStyle('body', {
  margin: 0,
});

export const root = styleVariants({
  right: {
    flexDirection: 'row',
  },
  bottom: {
    flexDirection: 'column',
  },
  undocked: {},
});

// Prevents the editor growing off screen
// when resizable value increases past maximum size
export const previewContainer = style({
  minWidth: 0,
  minHeight: 0,
});

export const editorSize = createVar();

export const resizable = style([
  sprinkles({
    overflow: 'hidden',
    boxShadow: 'small',
  }),
]);

// override re-resizable's inline style
// clamp ensures editor transitioning to correct size
// before applying minimum and maximum sizes
export const resizableSize = styleVariants({
  right: {
    width: `clamp(${MIN_WIDTH}px, ${editorSize}, ${MAX_WIDTH}) !important`,
  },
  bottom: {
    height: `clamp(${MIN_HEIGHT}px, ${editorSize}, ${MAX_HEIGHT}) !important`,
  },
});

export const resizableAvailable = styleVariants({
  right: {
    maxWidth: MAX_WIDTH,
  },
  bottom: {
    maxHeight: MAX_HEIGHT,
  },
});

export const resizableUnavailable = style({
  transitionProperty: 'width, height',
  transitionDuration: `${ANIMATION_TIMEOUT}ms`,
  transitionTimingFunction: 'ease',
});

export const isBottom = style({});

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
      [`&${isBottom}`]: {
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

export const editorContainer = style([
  sprinkles({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  }),
  {
    right: toolbarItemSize,
  },
]);

export const toolbarContainer = sprinkles({
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
});
