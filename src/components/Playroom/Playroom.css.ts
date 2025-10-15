import {
  style,
  globalStyle,
  createVar,
  fallbackVar,
  styleVariants,
} from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { space, newline } from '../../css/delimiters';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

globalStyle('html, body', {
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  backgroundColor: colorPaletteVars.background.body,
  scrollbarColor: space(colorPaletteVars.border.standard, 'transparent'),
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
    isolation: 'isolate',
  },
]);

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
  outline: `1px solid ${colorPaletteVars.border.standard}`,
});
export const frames = style({
  gridArea: 'frames',
});

export const editor = style({
  gridArea: 'editor',
  outline: `1px solid ${colorPaletteVars.border.standard}`,
});

export const framesContainer = sprinkles({
  position: 'absolute',
  inset: 0,
});

export const editorContainer = sprinkles({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
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

const showCodeOutlineSize = '2px';
const showCodeRadius = 'large';
export const showCodeContainer = style([
  sprinkles({
    position: 'absolute',
    bottom: 0,
    left: 0,
    display: 'block',
    padding: 'xsmall',
    margin: 'small',
    borderRadius: showCodeRadius,
  }),
  {
    backdropFilter: 'blur(2px)',
    '::before': {
      content: '',
      position: 'absolute',
      inset: 1,
      pointerEvents: 'none',
      background: colorPaletteVars.background.floating,
      borderRadius: calc(vars.radii[showCodeRadius])
        .subtract(showCodeOutlineSize)
        .toString(),
      opacity: 0.8,
    },
    '::after': {
      content: '',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      borderRadius: calc(vars.radii[showCodeRadius])
        .subtract(showCodeOutlineSize)
        .toString(),
      outline: `${showCodeOutlineSize} solid var(--border-standard__1oi8mvoo)`,
      outlineOffset: `-${showCodeOutlineSize}`,
    },
  },
]);

export const hideCodeContainer = sprinkles({
  position: 'absolute',
});

export const hideCodeContainerHorizontal = sprinkles({
  top: 0,
  right: 0,
  padding: 'xxxsmall',
});

export const hideCodeContainerVertical = sprinkles({
  bottom: 0,
  right: 0,
  paddingY: 'medium',
  paddingX: 'xxxsmall',
});
