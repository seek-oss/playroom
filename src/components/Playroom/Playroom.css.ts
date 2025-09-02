import {
  style,
  globalStyle,
  createVar,
  fallbackVar,
  styleVariants,
} from '@vanilla-extract/css';

import { space, comma, newline } from '../../css/delimiters';
import { ANIMATION_DURATION_SLOW } from '../constants';

import { sharedPopupStyles } from '../../css/shared.css';
import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

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

const editorHeight = createVar();
const editorWidth = createVar();
export const editorSize = createVar();
export const assistantWidth = createVar();
export const root = style([
  sprinkles({
    height: 'viewport',
    width: 'viewport',
  }),
  {
    display: 'grid',
    gridTemplateColumns: space(fallbackVar(editorWidth, '0px'), '1fr'),
    gridTemplateRows: space(
      'min-content',
      'auto',
      fallbackVar(editorHeight, '0px')
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

export const editorOrientation = styleVariants({
  horizontal: [
    {
      vars: {
        [editorHeight]: `clamp(150px, ${editorSize}, 70vh)`,
      },
      gridTemplateAreas: newline(
        '"header header"',
        '"frames frames"',
        '"editor editor"'
      ),
    },
  ],
  vertical: [
    {
      vars: {
        [editorWidth]: `clamp(150px, ${editorSize}, 90vw)`,
      },
      gridTemplateAreas: newline(
        '"header header"',
        '"editor frames"',
        '"editor frames"'
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

export const editorOverlays = style([
  sprinkles({
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    gap: 'xsmall',
    alignItems: 'center',
  }),
  {
    left: vars.space.medium,
    right: vars.space.medium,
    bottom: vars.space.medium,
    width: 'fit-content',
    marginInline: 'auto',
  },
]);

export const editorActions = style([
  sprinkles({ display: 'flex', gap: 'xsmall' }),
  sharedPopupStyles('small'),
]);

export const editorActionButton = style([
  sprinkles({
    padding: 'xsmall',
    borderRadius: 'small',
    display: 'flex',
    alignItems: 'center',
    gap: 'xsmall',
    border: 0,
  }),
  {
    background: 'transparent',
    color: colorPaletteVars.foreground.neutral,
    ':hover': {
      backgroundColor: colorPaletteVars.background.selection,
    },
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 2,
    },
  },
]);

export const snippetsPopupWidth = style({
  width: 'min(300px, 90vw)',
});
