import {
  style,
  globalStyle,
  styleVariants,
  createVar,
} from '@vanilla-extract/css';
import { sprinkles, colorPaletteVars } from './sprinkles.css';
import { vars } from './vars.css';
import { toolbarItemSize } from './ToolbarItem/ToolbarItem.css';
import { toolbarItemCount, toolbarOpenSize } from './toolbarConstants';

export const MIN_HEIGHT = toolbarItemSize * toolbarItemCount;
export const MIN_WIDTH = toolbarOpenSize + toolbarItemSize + 80;

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

export const root = sprinkles({
  height: 'viewport',
  width: 'viewport',
});

export const previewContainer = sprinkles({
  position: 'absolute',
  inset: 0,
});

export const editorSize = createVar();

export const previewContainerPosition = styleVariants({
  right: {
    right: `max(${editorSize}, ${MIN_WIDTH}px)`,
  },
  bottom: {
    bottom: `max(${editorSize}, ${MIN_HEIGHT}px)`,
  },
  undocked: {},
});

export const resizableContainer = style([
  sprinkles({
    bottom: 0,
    right: 0,
    overflow: 'hidden',
    boxShadow: 'small',
    transition: 'slow',
  }),
  // @ts-expect-error Shouldnt need to but types do not like `!important`
  {
    position: 'absolute !important', // override re-resizable's inline style
  },
]);

export const resizableContainer_isHidden = style({});

export const resizableContainer_isRight = style([
  sprinkles({
    top: 0,
  }),
  {
    maxWidth: '90vw',
    selectors: {
      [`&${resizableContainer_isHidden}`]: {
        transform: 'translateX(100%)',
      },
    },
  },
]);

export const resizableContainer_isBottom = style([
  sprinkles({
    left: 0,
  }),
  {
    maxHeight: '90vh',
    selectors: {
      [`&${resizableContainer_isHidden}`]: {
        transform: 'translateY(100%)',
      },
    },
  },
]);

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
