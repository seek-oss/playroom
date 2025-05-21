import { sprinkles, colorPaletteVars } from '../sprinkles.css';
import { vars } from '../vars.css';
import { style, globalStyle } from '@vanilla-extract/css';

export const toolbarItemSize = 32;

export const success = style({});
export const disabled = style({});
export const showIndicator = style({});
export const button_isActive = style({});
export const button = style([
  sprinkles({
    position: 'relative',
    border: 0,
    padding: 'none',
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    outline: 'none',
    height: toolbarItemSize,
    width: toolbarItemSize,
    color: 'currentColor',
    backgroundColor: colorPaletteVars.background.surface,
    WebkitTapHighlightColor: 'transparent',
    flexShrink: 0,

    // Background
    '::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colorPaletteVars.background.selection,
      opacity: 0,
      transition: vars.transition.slow,
      pointerEvents: 'none',
      borderRadius: 4,
    },

    selectors: {
      [`&${success}`]: {
        color: colorPaletteVars.foreground.positive,
      },

      [`&:not(${disabled})`]: {
        cursor: 'pointer',
      },

      [`&${disabled}`]: {
        color: colorPaletteVars.foreground.neutralSoft,
      },

      [[
        `&${showIndicator}`,
        `&${button_isActive}:not(${success}):not(${disabled})`,
        `html:not([data-playroom-dark]) &:hover:not(${success}):not(${disabled})`,
      ].join(',')]: {
        color: colorPaletteVars.foreground.accent,
      },

      [`&:not(${success}):not(:hover):focus::before`]: {
        color: colorPaletteVars.foreground.neutral,
      },
      [[
        `&:not(${success}):not(${disabled}):focus::before`,
        `&:not(${success}):not(${disabled}):hover::before`,
      ].join(',')]: {
        opacity: 1,
      },

      [`&:not(${button_isActive})::after`]: {
        transform: 'translateX(100%)',
        opacity: 0,
      },
    },
  },
]);

export const show = style({});
export const indicator = style([
  sprinkles({
    position: 'absolute',
    borderRadius: 'full',
    pointerEvents: 'none',
    transition: 'fast',
  }),
  {
    top: '2px',
    right: '2px',
    height: '6px',
    width: '6px',
    backgroundColor: colorPaletteVars.background.accent,
    border: `2px solid ${colorPaletteVars.background.surface}`,
    selectors: {
      [`&:not(${show})`]: {
        transform: 'scale(0)',
        opacity: 0,
      },
    },
  },
]);

export const successIndicator = style([
  sprinkles({
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'full',
    pointerEvents: 'none',
    transition: 'fast',
  }),
  {
    top: '12px',
    right: '12px',
    height: '14px',
    width: '14px',
    backgroundColor: colorPaletteVars.foreground.positive,
    border: `2px solid ${colorPaletteVars.background.surface}`,
    selectors: {
      [`&:not(${show})`]: {
        transform: 'translate3d(-15px, 9px, 0) scale(0)',
        opacity: 0,
      },
    },
  },
]);

globalStyle(`${successIndicator} svg`, {
  color: colorPaletteVars.foreground.neutralInverted,
});
