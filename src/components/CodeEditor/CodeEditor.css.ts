import { style, globalStyle, keyframes } from '@vanilla-extract/css';

import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const minimumLineNumberWidth = '50px';

const textSelectionBackground = 'Highlight';

export const insertionPoint = style({
  backgroundColor: textSelectionBackground,
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
    borderRadius: 'medium',
    position: 'relative',
    textAlign: 'right',
    marginRight: 'xxsmall',
    paddingRight: 'xsmall',
    opacity: 0,
  }),
  {
    ':hover': {
      cursor: 'help',
    },
    backgroundColor: colorPaletteVars.background.critical,
    color: colorPaletteVars.foreground.critical,
    minWidth: minimumLineNumberWidth,
    animationName: fadeIn,
    animationDuration: '1s',
    animationTimingFunction: 'ease',
    animationIterationCount: 1,
    animationFillMode: 'forwards',
  },
]);

export const foldGutter = style([
  sprinkles({
    paddingY: 'none',
    paddingX: 'xsmall',
  }),
  {
    width: '1em',
  },
]);

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
  paddingLeft: vars.space.xsmall,
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
  padding: 0,
  boxShadow: colorPaletteVars.shadows.small,
  borderRadius: vars.radii.small,
  backgroundColor: colorPaletteVars.background.surface,
  fontSize: '90%',
  lineHeight: '150%',
  fontFamily: vars.font.family.code,
  maxHeight: '20em',
  overflowY: 'auto',
});
globalStyle('[data-playroom-dark] .CodeMirror-hints', {
  backgroundColor: colorPaletteVars.background.floating,
});

globalStyle('.CodeMirror-hint', {
  margin: 0,
  padding: `${vars.space.xxsmall} ${vars.space.xsmall}`,
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
  padding: `0 ${vars.space.xxsmall}`,
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
  right: vars.space.xxxsmall,
  height: '100%',
  boxShadow: `0 0 10px 5px ${colorPaletteVars.background.surface}`,
});

globalStyle('.cm-s-neo .CodeMirror-selected', {
  background: textSelectionBackground,
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
  background: colorPaletteVars.background.accentLight,
});

globalStyle('.cm-overlay.cm-searching', {
  paddingTop: vars.space.xxxsmall,
  paddingBottom: vars.space.xxxsmall,
  background: colorPaletteVars.background.selection,
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
  cursor: 'pointer',
  border: '1px solid currentColor',
});

globalStyle('.CodeMirror-dialog button:focus', {
  color: colorPaletteVars.foreground.accent,
  outline: `2px solid ${colorPaletteVars.outline.focus}`,
  outlineOffset: 0,
});

globalStyle('.CodeMirror-dialog button:focus:hover', {
  background: colorPaletteVars.background.selection,
});

globalStyle('.CodeMirror-dialog button:hover', {
  background: colorPaletteVars.background.transparent,
});
