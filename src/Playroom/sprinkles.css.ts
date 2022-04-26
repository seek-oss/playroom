import { createGlobalTheme, createThemeContract } from '@vanilla-extract/css';
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';
import { dark, light } from './palettes';

const fontFamily = 'Helvetica, arial, sans-serif';
export const vars = createGlobalTheme(':root', {
  font: {
    family: {
      standard: fontFamily,
      code: 'Source Code Pro, Firacode, Hasklig, Menlo, monospace',
    },
    scale: {
      xsmall: `normal 10px ${fontFamily}`,
      small: `normal 12px ${fontFamily}`,
      standard: `normal 14px ${fontFamily}`,
      large: `normal 16px/1.3em ${fontFamily}`,
    },
    weight: {
      weak: '100',
      strong: '700',
    },
  },
  grid: '4px',
  radii: {
    small: '2px',
    medium: '4px',
    large: '6px',
    full: '100%',
  },
  codeGutterSize: '70px',
  touchableSize: '44px',
  transition: {
    slow: 'opacity 300ms ease, transform 300ms ease',
    medium: 'opacity 200ms ease, transform 200ms ease',
    fast: 'opacity 100ms ease, transform 100ms ease',
  },
  space: {
    none: '0',
    xxsmall: '2px',
    xsmall: '4px',
    medium: '6px',
    large: '12px',
    xlarge: '16px',
    xxlarge: '20px',
    gutter: '40px',
  },
});

export const colorPaletteVars = createThemeContract({
  code: {
    text: null,
    tag: null,
    attribute: null,
    string: null,
    atom: null,
    variable: null,
    number: null,
  },
  foreground: {
    neutralSoft: null,
    neutral: null,
    neutralInverted: null,
    secondary: null,
    critical: null,
    accent: null,
    positive: null,
  },
  background: {
    transparent: null,
    accent: null,
    positive: null,
    critical: null,
    neutral: null,
    surface: null,
    body: null,
    selection: null,
  },
  border: {
    standard: null,
  },
  shadows: {
    small: null,
    focus: null,
  },
});

createGlobalTheme(':root', colorPaletteVars, light);
createGlobalTheme(':root[data-playroom-dark]', colorPaletteVars, dark);

const responsiveProperties = defineProperties({
  properties: {
    position: ['absolute', 'relative', 'fixed'],
    top: [0],
    bottom: [0],
    left: [0],
    right: [0],
    display: ['none', 'flex', 'block', 'inline'],
    flexDirection: ['row', 'column', 'row-reverse'],
    flexWrap: ['wrap'],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    marginTop: vars.space,
    marginBottom: vars.space,
    marginLeft: vars.space,
    marginRight: vars.space,
    overflow: ['hidden', 'auto'],
    boxShadow: colorPaletteVars.shadows,
    borderRadius: vars.radii,
    transition: vars.transition,
    cursor: ['pointer'],
    pointerEvents: ['none', 'auto'],
    userSelect: ['none'],
    appearance: ['none'],
    opacity: [0],
    zIndex: [0, 1],
    font: vars.font.scale,
    fontWeight: vars.font.weight,
    width: { full: '100%', viewport: '100vw' },
    height: { full: '100%', viewport: '100vh' },
    whiteSpace: ['nowrap'],
    boxSizing: ['border-box'],
    textAlign: ['center', 'left', 'right'],
    border: [0],
  },
  shorthands: {
    inset: ['top', 'bottom', 'left', 'right'],
    padding: ['paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'],
    paddingX: ['paddingLeft', 'paddingRight'],
    paddingY: ['paddingTop', 'paddingBottom'],
    margin: ['marginTop', 'marginBottom', 'marginLeft', 'marginRight'],
    marginX: ['marginLeft', 'marginRight'],
    marginY: ['marginTop', 'marginBottom'],
    placeItems: ['justifyContent', 'alignItems'],
  },
});

export const sprinkles = createSprinkles(responsiveProperties);
