import { createGlobalTheme } from '@vanilla-extract/css';

export const fontFamily = 'Helvetica, arial, sans-serif';
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
      large: `normal 16px/20px ${fontFamily}`,
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
    small: '6px',
    medium: '8px',
    large: '12px',
    xlarge: '16px',
    xxlarge: '20px',
    xxxlarge: '28px',
    gutter: '40px',
  },
});
