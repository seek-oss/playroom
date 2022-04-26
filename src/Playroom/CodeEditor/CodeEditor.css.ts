import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars, colorPaletteVars, sprinkles } from '../sprinkles.css';

const minimumLineNumberWidth = '50px';

export const insertionPoint = style({
  backgroundColor: colorPaletteVars.background.selection,
});

const fadeIn = keyframes({
  '90%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
});
export const errorMarker = style([
  sprinkles({
    borderRadius: 'large',
    position: 'relative',
    textAlign: 'right',
    opacity: 0,
  }),
  {
    backgroundColor: colorPaletteVars.background.critical,
    color: colorPaletteVars.foreground.critical,
    minWidth: minimumLineNumberWidth,
    marginRight: '4px',
    paddingRight: '8px',
    animationName: fadeIn,
    animationDuration: '1s',
    animationTimingFunction: 'ease',
    animationIterationCount: 1,
    animationFillMode: 'forwards',
  },
]);

export const foldGutter = style({
  width: '1em',
  padding: '0 8px',
});

export const foldOpen = style([
  sprinkles({ cursor: 'pointer' }),
  {
    '::after': {
      content: '-',
    },
  },
]);

export const foldFolded = style([
  sprinkles({ cursor: 'pointer' }),
  {
    '::after': {
      content: '+',
      color: colorPaletteVars.foreground.accent,
    },
  },
]);

globalStyle('.react-codemirror2', {
  height: '100%',
  backgroundColor: colorPaletteVars.background.surface,
});

globalStyle('.CodeMirror', {
  height: '100%',
  width: '100%',
  fontFamily: vars.font.family.code,
  position: 'relative',
  zIndex: 0,
});

globalStyle('.CodeMirror-gutters', {
  minWidth: vars.codeGutterSize,
  boxSizing: 'border-box',
  paddingLeft: '8px',
});

globalStyle('.CodeMirror pre, .CodeMirror-linenumber', {
  fontSize: '16px',
});

globalStyle('.CodeMirror-lines', {
  padding: '16px 0',
});

globalStyle('.CodeMirror-hints', {
  position: 'absolute',
  zIndex: 10,
  overflow: 'hidden',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  boxShadow: colorPaletteVars.shadows.small,
  borderRadius: vars.radii.medium,
  backgroundColor: colorPaletteVars.background.surface,
  fontSize: '90%',
  lineHeight: '150%',
  fontFamily: vars.font.family.code,
  maxHeight: '20em',
  overflowY: 'auto',
});
globalStyle('[data-playroom-dark] .CodeMirror-hints', {
  backgroundColor: colorPaletteVars.background.neutral,
});

globalStyle('.CodeMirror-hint', {
  margin: 0,
  padding: '4px 8px',
  borderRadius: vars.radii.small,
  whiteSpace: 'pre',
  color: colorPaletteVars.code.text,
  cursor: 'pointer',
});

globalStyle('li.CodeMirror-hint-active', {
  backgroundColor: colorPaletteVars.background.accent,
  color: colorPaletteVars.foreground.neutralInverted,
});

globalStyle('.CodeMirror-linenumbers', {
  minWidth: minimumLineNumberWidth,
});

globalStyle('.CodeMirror-foldmarker', {
  color: colorPaletteVars.foreground.accent,
  fontFamily: 'arial',
  cursor: 'pointer',
  padding: `0 ${vars.grid}`,
});

globalStyle('.cm-s-neo.CodeMirror', {
  backgroundColor: colorPaletteVars.background.surface,
  color: colorPaletteVars.code.text,
});

globalStyle('.cm-s-neo .CodeMirror-cursor', {
  backgroundColor: colorPaletteVars.foreground.neutral,
  width: '2px',
});

globalStyle('.cm-s-neo .CodeMirror-gutters', {
  backgroundColor: colorPaletteVars.background.surface,
  border: 'none',
});

globalStyle('.cm-s-neo .CodeMirror-gutters::after', {
  content: '""',
  backgroundColor: colorPaletteVars.background.surface,
  position: 'absolute',
  right: '2px',
  height: '100%',
  boxShadow: `0 0 10px 5px ${colorPaletteVars.background.surface}`,
});

globalStyle('.cm-s-neo .CodeMirror-selected', {
  background: colorPaletteVars.background.selection,
});

globalStyle('.cm-s-neo .CodeMirror-activeline-background', {
  background: 'transparent',
});

globalStyle('.cm-s-neo .CodeMirror-guttermarker-subtle', {
  display: 'flex',
  justifyContent: 'center',
  color: colorPaletteVars.foreground.neutral,
  transition: vars.transition.fast,
});

globalStyle(
  `.cm-s-neo .CodeMirror-guttermarker-subtle:not(:hover):not(${foldFolded})`,
  {
    color: colorPaletteVars.foreground.neutralSoft,
  }
);

globalStyle('.cm-s-neo .CodeMirror-linenumber', {
  minWidth: minimumLineNumberWidth,
  color: colorPaletteVars.foreground.neutral,
  transition: vars.transition.fast,
});

globalStyle(
  '.cm-s-neo .CodeMirror-linenumber:not(:hover):not(.cm-s-neo .CodeMirror-activeline .CodeMirror-linenumber)',
  {
    color: colorPaletteVars.foreground.neutralSoft,
  }
);

globalStyle('.cm-s-neo .cm-tag', {
  color: colorPaletteVars.code.tag,
});

globalStyle(
  [
    '.cm-s-neo .cm-attribute',
    '.cm-s-neo .cm-keyword',
    '.cm-s-neo .cm-property',
  ].join(','),
  {
    color: colorPaletteVars.code.attribute,
  }
);

globalStyle('.cm-s-neo .cm-string', {
  color: colorPaletteVars.code.string,
});

globalStyle('.cm-s-neo .cm-atom', {
  color: colorPaletteVars.code.atom,
});

globalStyle('.cm-s-neo .cm-variable', {
  color: colorPaletteVars.code.variable,
});

globalStyle('.cm-s-neo .cm-number', {
  color: colorPaletteVars.code.number,
});
