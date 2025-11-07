import { style, globalStyle } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { fontSizeDefinitions, vars } from '../../css/vars.css';

const minimumLineNumberWidth = '50px';

export const insertionPoint = style({
  backgroundColor: colorPaletteVars.background.selection,
});

export const errorMarker = style([
  sprinkles({
    borderRadius: 'small',
    position: 'relative',
    textAlign: 'right',
    marginRight: 'xxsmall',
    paddingRight: 'xsmall',
    opacity: 0,
    transition: 'fast',
  }),
  {
    backgroundColor: colorPaletteVars.background.critical,
    color: colorPaletteVars.foreground.critical,
    minWidth: minimumLineNumberWidth,
  },
]);

export const showErrorMarker = style({
  opacity: 1,
});

export const foldGutter = style([
  sprinkles({
    paddingY: 'none',
    paddingX: 'xxsmall',
  }),
  {
    width: '1em',
  },
]);

export const foldOpen = style({
  '::after': {
    content: '-',
  },
});

export const foldFolded = style({
  '::after': {
    content: '+',
    opacity: 1,
  },
});

globalStyle('.react-codemirror2', {
  height: '100%',
});

globalStyle('.CodeMirror', {
  height: '100%',
  width: '100%',
  fontFamily: vars.font.family.code,
  position: 'relative',
  zIndex: 0,
});

globalStyle('.CodeMirror-gutters', {
  boxSizing: 'border-box',
  paddingLeft: vars.space.xxsmall,
});

globalStyle('.CodeMirror pre, .CodeMirror-linenumber', {
  fontSize: '16px',
});

globalStyle('.CodeMirror-lines', {
  padding: `${vars.space.medium} 0`,
});

globalStyle('.CodeMirror-hints', {
  position: 'absolute',
  zIndex: 10,
  overflow: 'hidden',
  listStyle: 'none',
  margin: 0,
  padding: vars.space.xxxsmall,
  boxShadow: colorPaletteVars.shadows.small,
  borderRadius: vars.radii.medium,
  backgroundColor: colorPaletteVars.background.floating,
  border: `1px solid ${colorPaletteVars.border.standard}`,
  fontSize: fontSizeDefinitions.standard[0],
  lineHeight: `${fontSizeDefinitions.standard[1]}px`,
  fontFamily: vars.font.family.code,
  maxHeight: '20em',
  overflowY: 'auto',
});

globalStyle('.CodeMirror-hint', {
  margin: 0,
  padding: `${vars.space.xxsmall} ${vars.space.xsmall}`,
  borderRadius: vars.radii.small,
  whiteSpace: 'pre',
  color: colorPaletteVars.code.text,
  cursor: 'default',
  height: vars.buttonSizes.medium,
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  boxSizing: 'border-box',
});

globalStyle('.CodeMirror-hint::before', {
  content: '',
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  borderRadius: vars.radii.small,
  zIndex: -1,
  backgroundColor: colorPaletteVars.background.selection,
  opacity: 0,
});

globalStyle('.CodeMirror-hint-active::before', {
  opacity: 1,
});

globalStyle('.CodeMirror-linenumbers', {
  minWidth: minimumLineNumberWidth,
});

globalStyle('.CodeMirror-foldmarker', {
  color: colorPaletteVars.foreground.accent,
  fontFamily: 'arial',
  cursor: 'default',
  padding: `0 ${vars.space.xxsmall}`,
});

const editorBackground = colorPaletteVars.background.surface;
globalStyle('.cm-s-neo.CodeMirror', {
  backgroundColor: editorBackground,
  color: colorPaletteVars.code.text,
});
const scrollAffordanceFadeWidth = '20px';
globalStyle('.cm-s-neo.CodeMirror::after', {
  position: 'absolute',
  content: '',
  top: 0,
  bottom: 0,
  width: scrollAffordanceFadeWidth,
  background: `linear-gradient(90deg, transparent, ${editorBackground})`,
  right: 0,
  pointerEvents: 'none',
});

globalStyle('.CodeMirror-scroll', {
  paddingRight: scrollAffordanceFadeWidth,
});

globalStyle('.cm-s-neo .CodeMirror-cursor', {
  backgroundColor: colorPaletteVars.foreground.neutral,
  width: '2px',
});

globalStyle('.cm-s-neo .CodeMirror-gutters', {
  backgroundColor: editorBackground,
  border: 'none',
});

globalStyle('.cm-s-neo .CodeMirror-gutters::after', {
  content: '""',
  backgroundColor: editorBackground,
  position: 'absolute',
  right: vars.space.xxxsmall,
  height: '100%',
  boxShadow: `0 0 10px 5px ${editorBackground}`,
});

globalStyle('.cm-s-neo .CodeMirror-selected', {
  background: colorPaletteVars.background.textSelection,
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

const inactiveNumberLineOpacity = 0.4;
globalStyle(
  `.cm-s-neo .CodeMirror-guttermarker-subtle:not(:hover):not(${foldFolded})`,
  {
    color: colorPaletteVars.foreground.neutral,
    opacity: inactiveNumberLineOpacity,
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
    opacity: inactiveNumberLineOpacity,
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

const searchOffset = vars.touchableSize;
globalStyle('.CodeMirror-dialog', {
  paddingLeft: vars.space.medium,
  paddingRight: vars.space.medium,
  minHeight: searchOffset,
  borderBottom: `1px solid ${colorPaletteVars.border.standard}`,
  display: 'flex',
  alignItems: 'center',
});

globalStyle('.CodeMirror-scroll', {
  transition: vars.transition.fast,
});

globalStyle('.dialog-opened .CodeMirror-scroll', {
  transform: `translateY(${searchOffset})`,
});

globalStyle('.dialog-opened .CodeMirror-lines', {
  paddingBottom: searchOffset,
});

globalStyle('.CodeMirror-dialog input', {
  font: vars.font.scale.large,
  fontFamily: vars.font.family.code,
  height: vars.touchableSize,
  flexGrow: 1,
});

globalStyle('.CodeMirror-search-hint', {
  display: 'none',
});

globalStyle('.CodeMirror-search-label', {
  display: 'flex',
  alignItems: 'center',
  minHeight: vars.touchableSize,
  font: vars.font.scale.large,
  fontFamily: vars.font.family.code,
});

globalStyle('.CodeMirror-search-field', {
  paddingLeft: vars.space.medium,
});

globalStyle('label.CodeMirror-search-label', {
  flexGrow: 1,
});

globalStyle('.dialog-opened.cm-s-neo .CodeMirror-selected', {
  background: colorPaletteVars.background.textSelection,
});

globalStyle('.cm-overlay.cm-searching', {
  paddingTop: vars.space.xxxsmall,
  paddingBottom: vars.space.xxxsmall,
  background: colorPaletteVars.background.textSelection,
});

globalStyle('.CodeMirror-dialog button:first-of-type', {
  marginLeft: vars.space.medium,
});

globalStyle('.CodeMirror-dialog button', {
  appearance: 'none',
  font: vars.font.scale.standard,
  fontFamily: vars.font.family.standard,
  marginLeft: vars.space.xsmall,
  paddingTop: vars.space.xxsmall,
  paddingBottom: vars.space.xxsmall,
  paddingLeft: vars.space.small,
  paddingRight: vars.space.small,
  alignSelf: 'center',
  display: 'block',
  background: 'none',
  borderRadius: vars.radii.medium,
  cursor: 'default',
  border: `1px solid ${colorPaletteVars.border.standard}`,
});

globalStyle('.CodeMirror-dialog button:focus-visible', {
  outline: `2px solid ${colorPaletteVars.outline.focus}`,
  outlineOffset: 0,
});

globalStyle('.CodeMirror-dialog button:hover', {
  background: colorPaletteVars.background.selection,
});
