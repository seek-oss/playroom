import { createGlobalTheme } from '@vanilla-extract/css';

const fontFamily = '"Plus Jakarta Sans", sans-serif';
export const fontSizeDefinitions = {
  xsmall: [10, 14],
  small: [12, 16],
  standard: [14, 20],
  large: [16, 22],
};

const fontScale = Object.fromEntries(
  Object.entries(fontSizeDefinitions).map(([size, definition]) => [
    size,
    `normal ${definition.map((v) => `${v}px`).join('/')} ${fontFamily}`,
  ])
);

export const vars = createGlobalTheme(':root', {
  font: {
    family: {
      standard: fontFamily,
      code: 'Source Code Pro, Firacode, Hasklig, Menlo, monospace',
    },
    scale: fontScale,
    weight: {
      normal: '400',
      strong: '700',
    },
  },
  radii: {
    small: '4px',
    medium: '8px',
    large: '16px',
    full: '100%',
  },
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
  buttonSizes: {
    small: '28px',
    medium: '32px',
    large: '36px',
  },
});
