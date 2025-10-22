import { comma } from './delimiters';

const originalPalette = {
  blue0: '#e5f3ff',
  blue1: '#0088ff',
  blue2: '#005ad2',
  blue3: '#00439c',
  blue4: '#040080',
  green1: '#c5f5e9',
  green2: '#1da584',
  red1: '#fee1e9',
  red2: '#e52b50',
  red3: '#cd193d',
  purple: '#75438a',
  white: '#fff',
  gray0: '#f7f7f7',
  gray1: '#f4f4f4',
  gray2: '#eeeeee',
  gray3: '#a7a7a7',
  gray4: '#767676',
  gray5: '#515151',
  gray6: '#1e1e1e',
  gray7: '#1c1c1b',
  black: '#000',
};

const guard = (amount: number) => {
  if (amount > 1 || amount < 0) {
    throw new Error('Amount must be between 0 and 1 inclusive');
  }

  return amount;
};

/**
 * Subtracts `amount` from the alpha channel of `color`.
 * Amount must be between 0 and 1 inclusive.
 *
 * Similar to `transparentize` from polished but uses CSS
 * @see https://polished.js.org/docs/#transparentize
 */
const transparentize = (amount: number, color: string) =>
  `rgb(from ${color} r g b / calc(alpha - ${guard(amount)}))`;

/**
 * Mixes `amount` of `color1` into `color2`.
 * Amount must be between 0 and 1 inclusive.
 *
 * Similar to `mix` from polished but uses CSS
 * @see https://polished.js.org/docs/#mix
 */
const mix = (amount: number, color1: string, color2: string) =>
  `color-mix(in srgb, ${color1} ${guard(amount) * 100}%, ${color2})`;

const lightPalette = {
  background: {
    100: 'hsla(0,0%,100%,1)',
    200: 'hsla(0,0%,98%,1)',
  },
  gray: {
    100: 'hsla(0, 0%, 95%, 1)',
    200: 'hsla(0, 0%, 92%, 1)',
    300: 'hsla(0, 0%, 90%, 1)',
    400: 'hsla(0, 0%, 92%, 1)',
    500: 'hsla(0, 0%, 79%, 1)',
    600: 'hsla(0, 0%, 66%, 1)',
    700: 'hsla(0, 0%, 56%, 1)',
    800: 'hsla(0, 0%, 49%, 1)',
    900: 'hsla(0, 0%, 40%, 1)',
    1000: 'hsla(0, 0%, 9%, 1)',
  },
  blue: {
    100: 'hsla(212, 100%, 97%, 1)',
    200: 'hsla(210, 100%, 96%, 1)',
    300: 'hsla(210, 100%, 94%, 1)',
    400: 'hsla(209, 100%, 90%, 1)',
    500: 'hsla(209, 100%, 80%, 1)',
    600: 'hsla(208, 100%, 66%, 1)',
    700: 'hsla(212, 100%, 48%, 1)',
    800: 'hsla(212, 100%, 41%, 1)',
    900: 'hsla(211, 100%, 42%, 1)',
    1000: 'hsla(211, 100%, 15%, 1)',
  },
  red: {
    100: 'hsla(0, 100%, 97%, 1)',
    200: 'hsla(0, 100%, 96%, 1)',
    300: 'hsla(0, 100%, 95%, 1)',
    400: 'hsla(0, 90%, 92%, 1)',
    500: 'hsla(0, 82%, 85%, 1)',
    600: 'hsla(359, 90%, 71%, 1)',
    700: 'hsla(358, 75%, 59%, 1)',
    800: 'hsla(358, 70%, 52%, 1)',
    900: 'hsla(358, 66%, 48%, 1)',
    1000: 'hsla(355, 49%, 15%, 1)',
  },
  green: {
    100: 'hsla(120, 60%, 96%, 1)',
    200: 'hsla(120, 60%, 95%, 1)',
    300: 'hsla(120, 60%, 91%, 1)',
    400: 'hsla(122, 60%, 86%, 1)',
    500: 'hsla(124, 60%, 75%, 1)',
    600: 'hsla(125, 60%, 64%, 1)',
    700: 'hsla(131, 41%, 46%, 1)',
    800: 'hsla(132, 43%, 39%, 1)',
    900: 'hsla(133, 50%, 32%, 1)',
    1000: 'hsla(128, 29%, 15%, 1)',
  },
  purple: {
    100: 'hsla(276, 100%, 97%, 1)',
    200: 'hsla(277, 87%, 97%, 1)',
    300: 'hsla(274, 78%, 95%, 1)',
    400: 'hsla(276, 71%, 92%, 1)',
    500: 'hsla(274, 70%, 82%, 1)',
    600: 'hsla(273, 72%, 73%, 1)',
    700: 'hsla(272, 51%, 54%, 1)',
    800: 'hsla(272, 47%, 45%, 1)',
    900: 'hsla(274, 71%, 43%, 1)',
    1000: 'hsla(276, 100%, 15%, 1)',
  },
  teal: {
    100: 'hsla(169, 70%, 96%, 1)',
    200: 'hsla(167, 70%, 94%, 1)',
    300: 'hsla(168, 70%, 90%, 1)',
    400: 'hsla(170, 70%, 85%, 1)',
    500: 'hsla(170, 70%, 72%, 1)',
    600: 'hsla(170, 70%, 57%, 1)',
    700: 'hsla(173, 80%, 36%, 1)',
    800: 'hsla(173, 83%, 30%, 1)',
    900: 'hsla(174, 91%, 25%, 1)',
    1000: 'hsla(171, 80%, 13%, 1)',
  },
};

const darkPalette = {
  background: {
    100: 'hsla(0,0%,4%,1)',
    200: 'hsla(0,0%,0%,1)',
  },
  gray: {
    100: 'hsla(0, 0%, 10%, 1)',
    200: 'hsla(0, 0%, 12%, 1)',
    300: 'hsla(0, 0%, 16%, 1)',
    400: 'hsla(0, 0%, 18%, 1)',
    500: 'hsla(0, 0%, 27%, 1)',
    600: 'hsla(0, 0%, 53%, 1)',
    700: 'hsla(0, 0%, 56%, 1)',
    800: 'hsla(0, 0%, 49%, 1)',
    900: 'hsla(0, 0%, 63%, 1)',
    1000: 'hsla(0, 0%, 93%, 1)',
  },
  blue: {
    100: 'hsla(216, 50%, 12%, 1)',
    200: 'hsla(214, 59%, 15%, 1)',
    300: 'hsla(213, 71%, 20%, 1)',
    400: 'hsla(212, 78%, 23%, 1)',
    500: 'hsla(211, 86%, 27%, 1)',
    600: 'hsla(206, 100%, 50%, 1)',
    700: 'hsla(212, 100%, 48%, 1)',
    800: 'hsla(212, 100%, 41%, 1)',
    900: 'hsla(210, 100%, 66%, 1)',
    1000: 'hsla(206, 100%, 96%, 1)',
  },
  red: {
    100: 'hsla(357, 37%, 12%, 1)',
    200: 'hsla(357, 46%, 16%, 1)',
    300: 'hsla(356, 54%, 22%, 1)',
    400: 'hsla(357, 55%, 26%, 1)',
    500: 'hsla(357, 60%, 32%, 1)',
    600: 'hsla(358, 75%, 59%, 1)',
    700: 'hsla(358, 75%, 59%, 1)',
    800: 'hsla(358, 69%, 52%, 1)',
    900: 'hsla(358, 100%, 69%, 1)',
    1000: 'hsla(353, 90%, 96%, 1)',
  },
  green: {
    100: 'hsla(136, 50%, 9%, 1)',
    200: 'hsla(137, 50%, 12%, 1)',
    300: 'hsla(136, 50%, 14%, 1)',
    400: 'hsla(135, 70%, 16%, 1)',
    500: 'hsla(135, 70%, 23%, 1)',
    600: 'hsla(135, 70%, 34%, 1)',
    700: 'hsla(131, 41%, 46%, 1)',
    800: 'hsla(132, 43%, 39%, 1)',
    900: 'hsla(131, 43%, 57%, 1)',
    1000: 'hsla(136, 73%, 94%, 1)',
  },
  purple: {
    100: 'hsla(283, 30%, 12%, 1)',
    200: 'hsla(281, 38%, 16%, 1)',
    300: 'hsla(279, 44%, 23%, 1)',
    400: 'hsla(277, 46%, 28%, 1)',
    500: 'hsla(274, 49%, 35%, 1)',
    600: 'hsla(272, 51%, 54%, 1)',
    700: 'hsla(272, 51%, 54%, 1)',
    800: 'hsla(272, 47%, 45%, 1)',
    900: 'hsla(275, 80%, 71%, 1)',
    1000: 'hsla(281, 73%, 96%, 1)',
  },
  teal: {
    100: 'hsla(169, 78%, 7%, 1)',
    200: 'hsla(170, 74%, 9%, 1)',
    300: 'hsla(171, 75%, 13%, 1)',
    400: 'hsla(171, 85%, 13%, 1)',
    500: 'hsla(172, 85%, 20%, 1)',
    600: 'hsla(172, 85%, 32%, 1)',
    700: 'hsla(173, 80%, 36%, 1)',
    800: 'hsla(173, 83%, 30%, 1)',
    900: 'hsla(174, 90%, 41%, 1)',
    1000: 'hsla(166, 71%, 93%, 1)',
  },
};

export const light = {
  code: {
    text: lightPalette.gray[1000],
    tag: mix(0.5, lightPalette.blue[1000], lightPalette.blue[900]),
    attribute: lightPalette.blue[900],
    string: lightPalette.teal[900],
    atom: lightPalette.blue[800],
    variable: lightPalette.blue[700],
    number: lightPalette.purple[900],
  },
  foreground: {
    neutral: lightPalette.gray[1000],
    neutralInverted: darkPalette.gray[1000],
    secondary: lightPalette.gray[700],
    critical: lightPalette.red[900],
    accent: lightPalette.blue[800],
    positive: lightPalette.teal[900],
    tooltip: darkPalette.gray[1000],
  },
  background: {
    accent: lightPalette.blue[800],
    secondaryAccent: lightPalette.gray[1000],
    secondaryAccentLight: mix(0.1, '#fff', lightPalette.gray[1000]),
    positive: lightPalette.teal[300],
    critical: lightPalette.red[300],
    body: mix(0.5, lightPalette.gray[100], lightPalette.background[200]),
    surface: mix(
      0.5,
      lightPalette.background[200],
      lightPalette.background[100]
    ),
    floating: lightPalette.background[100],
    selection: lightPalette.gray[100],
    tooltip: lightPalette.gray[1000],
    textSelection: lightPalette.blue[400],
  },
  border: {
    standard: lightPalette.gray[400],
    accent: lightPalette.blue[800],
    tooltip: lightPalette.gray[1000],
  },
  outline: {
    focus: lightPalette.blue[600],
  },
  shadows: {
    small: comma(
      '0 1px 2px rgb(18, 21, 26, 0.05)',
      '0 6px 18px -6px rgb(18, 21, 26, 0.08)'
    ),
  },
};

export const dark = {
  code: {
    text: darkPalette.gray[1000],
    tag: mix(0.5, darkPalette.blue[1000], darkPalette.blue[900]),
    attribute: darkPalette.blue[900],
    string: mix(0.5, darkPalette.teal[1000], darkPalette.teal[900]),
    atom: darkPalette.blue[800],
    variable: darkPalette.blue[700],
    number: darkPalette.purple[900],
  },
  foreground: {
    neutral: darkPalette.gray[1000],
    neutralInverted: lightPalette.gray[1000],
    secondary: darkPalette.gray[700],
    critical: darkPalette.red[900],
    accent: darkPalette.blue[900],
    positive: darkPalette.teal[900],
    tooltip: darkPalette.gray[1000],
  },
  background: {
    accent: darkPalette.blue[900],
    secondaryAccent: darkPalette.gray[1000],
    secondaryAccentLight: mix(0.1, '#000', darkPalette.gray[1000]),
    positive: darkPalette.teal[300],
    critical: darkPalette.red[300],
    body: 'hsla(0,0%,0%,1)',
    surface: 'hsla(0,0%,6%,1)',
    floating: 'hsla(0,0%,2%,1)',
    selection: 'hsla(0,0%,12%,1)',
    tooltip: 'hsla(0,0%,0%,1)',
    textSelection: darkPalette.blue[400],
  },
  border: {
    standard: darkPalette.gray[400],
    accent: darkPalette.blue[900],
    tooltip: darkPalette.gray[200],
  },
  outline: {
    focus: darkPalette.blue[600],
  },
  shadows: {
    small: comma(
      `0 1px 2px ${transparentize(0.85, originalPalette.black)}`,
      `0 6px 18px -6px ${transparentize(0.92, originalPalette.black)}`
    ),
  },
};
