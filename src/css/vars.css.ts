import { createGlobalTheme } from '@vanilla-extract/css';

const fontFamily = '"Plus Jakarta Sans", sans-serif';
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
      strong: '700',
    },
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '16px',
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
    xxxsmall: '2px',
    xxsmall: '4px',
    xsmall: '8px',
    small: '12px',
    medium: '16px',
    large: '20px',
    xlarge: '24px',
    xxlarge: '32px',
    xxxlarge: '40px',
  },
});
