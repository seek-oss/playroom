import { createGlobalTheme, createThemeContract } from '@vanilla-extract/css';
import { defineProperties, createSprinkles } from '@vanilla-extract/sprinkles';

import { dark, light } from './palettes';

import { vars } from './vars.css';

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
    accentLight: null,
    positive: null,
    critical: null,
    neutral: null,
    surface: null,
    floating: null,
    body: null,
    selection: null,
  },
  border: {
    standard: null,
    accent: null,
  },
  outline: {
    focus: null,
  },
  shadows: {
    small: null,
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
    flexGrow: [0, 1],
    justifyContent: [
      'stretch',
      'flex-start',
      'center',
      'flex-end',
      'space-around',
      'space-between',
    ],
    alignItems: ['stretch', 'flex-start', 'center', 'flex-end'],
    gap: vars.space,
    paddingTop: vars.space,
    paddingBottom: vars.space,
    paddingLeft: vars.space,
    paddingRight: vars.space,
    marginTop: { ...vars.space, auto: 'auto' },
    marginBottom: { ...vars.space, auto: 'auto' },
    marginLeft: { ...vars.space, auto: 'auto' },
    marginRight: { ...vars.space, auto: 'auto' },
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
    width: { full: '100%', viewport: '100dvw' },
    height: { full: '100%', viewport: '100dvh' },
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

export type Sprinkles = Parameters<typeof sprinkles>[0];
