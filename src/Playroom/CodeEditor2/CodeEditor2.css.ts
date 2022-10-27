import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars, colorPaletteVars, sprinkles } from '../sprinkles.css';

const minimumGutterWidth = '30px';
//
// export const insertionPoint = style({
//   backgroundColor: colorPaletteVars.background.selection,
// });
//
// const fadeIn = keyframes({
//   '90%': {
//     opacity: 0,
//   },
//   '100%': {
//     opacity: 1,
//   },
// });
// export const errorMarker = style([
//   sprinkles({
//     borderRadius: 'large',
//     position: 'relative',
//     textAlign: 'right',
//     opacity: 0,
//   }),
//   {
//     backgroundColor: colorPaletteVars.background.critical,
//     color: colorPaletteVars.foreground.critical,
//     minWidth: minimumLineNumberWidth,
//     marginRight: '4px',
//     paddingRight: '8px',
//     animationName: fadeIn,
//     animationDuration: '1s',
//     animationTimingFunction: 'ease',
//     animationIterationCount: 1,
//     animationFillMode: 'forwards',
//   },
// ]);
//
// export const foldOpen = style([
//   sprinkles({ cursor: 'pointer' }),
//   {
//     '::after': {
//       content: '-',
//     },
//   },
// ]);
//
// export const foldFolded = style([
//   sprinkles({ cursor: 'pointer' }),
//   {
//     '::after': {
//       content: '+',
//       color: colorPaletteVars.foreground.accent,
//     },
//   },
// ]);
//
//

globalStyle('.code-editor', {
  height: '100%',
  backgroundColor: colorPaletteVars.background.surface,
});

// globalStyle('.cm-gutter .cm-foldGutter', {
//   width: '1em',
//   padding: '0 8px',
// });

globalStyle('.cm-editor', {
  paddingTop: '16px',
  height: '100%',
  width: '100%',
  fontFamily: vars.font.family.code,
  fontSize: '16px',
  position: 'relative',
  zIndex: 0,
});

globalStyle('.cm-content', {
  padding: '16px 0',
});

globalStyle('cm-gutter', {
  minWidth: vars.codeGutterSize,
  boxSizing: 'border-box',
  paddingLeft: '8px',
});

globalStyle('.cm-line', {
  padding: '16px 0',
});

globalStyle('.cm-tooltip-autocomplete', {
  overflow: 'hidden',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  boxShadow: colorPaletteVars.shadows.small,
  borderRadius: vars.radii.medium,
  fontSize: '90%',
  lineHeight: '150%',
  fontFamily: vars.font.family.code,
  maxHeight: '20em',
  overflowY: 'auto',
});
globalStyle('[data-playroom-dark] .cm-tooltip-autocomplete', {
  backgroundColor: colorPaletteVars.background.neutral,
});

globalStyle('.cm-tooltip.cm-tooltip-autocomplete', {
  border: 'none',
  backgroundColor: colorPaletteVars.background.surface,
});

const autocompleteOptionSelector =
  '.cm-tooltip.cm-tooltip-autocomplete > ul > li.cm-autocomplete-option';

globalStyle(autocompleteOptionSelector, {
  margin: 0,
  padding: '4px 8px',
  borderRadius: vars.radii.small,
  whiteSpace: 'pre',
  color: colorPaletteVars.code.text,
  cursor: 'pointer',
});

globalStyle(`${autocompleteOptionSelector}[aria-selected=true]`, {
  backgroundColor: colorPaletteVars.background.accent,
  color: colorPaletteVars.foreground.neutralInverted,
});

globalStyle('.cm-editor', {
  backgroundColor: colorPaletteVars.background.surface,
  color: colorPaletteVars.code.text,
});

globalStyle('.cm-cursorLayer .cm-cursor', {
  borderLeft: `2px solid ${colorPaletteVars.foreground.neutral}`,
});

globalStyle('.code-editor .cm-gutters', {
  backgroundColor: colorPaletteVars.background.surface,
  border: 'none',
  paddingLeft: '8px',
});

globalStyle('.code-editor .cm-gutters::after', {
  content: '""',
  backgroundColor: colorPaletteVars.background.surface,
  position: 'absolute',
  right: '2px',
  height: '100%',
  boxShadow: `0 0 10px 5px ${colorPaletteVars.background.surface}`,
});

const selectionBackgroundSelector =
  '.cm-selectionLayer .cm-selectionBackground';

globalStyle(
  `${selectionBackgroundSelector}, .cm-focused ${selectionBackgroundSelector}`,
  {
    background: colorPaletteVars.background.selection,
  }
);

globalStyle('.cm-gutterElement', {
  display: 'flex',
  justifyContent: 'center',
  minWidth: minimumGutterWidth,
  color: colorPaletteVars.foreground.neutralSoft,
  transition: vars.transition.fast,
});

globalStyle('.cm-line .cm-foldPlaceholder', {
  backgroundColor: 'transparent',
  color: colorPaletteVars.foreground.accent,
  fontFamily: 'arial',
  border: 'none',
  margin: 'none',
  padding: `0 ${vars.grid}`,
});

globalStyle('.cm-foldMarkerClose', {
  textAlign: 'center',
  cursor: 'pointer',
  minWidth: minimumGutterWidth,
});
globalStyle('.cm-foldMarkerClose:hover', {
  color: colorPaletteVars.foreground.neutral,
});

globalStyle('.cm-foldMarkerOpen', {
  textAlign: 'center',
  cursor: 'pointer',
  color: colorPaletteVars.foreground.accent,
  minWidth: minimumGutterWidth,
});

globalStyle('.cm-gutterElement.cm-activeLineGutter', {
  backgroundColor: 'transparent',
  color: colorPaletteVars.foreground.neutral,
});

globalStyle('.cm-tag', {
  color: colorPaletteVars.code.tag,
});

globalStyle('.cm-attribute, .cm-keyword, .cm-property', {
  color: colorPaletteVars.code.attribute,
});

globalStyle('.cm-string', {
  color: colorPaletteVars.code.string,
});

globalStyle('.cm-atom', {
  color: colorPaletteVars.code.atom,
});

globalStyle('.cm-variable', {
  color: colorPaletteVars.code.variable,
});

globalStyle('.cm-number', {
  color: colorPaletteVars.code.number,
});
