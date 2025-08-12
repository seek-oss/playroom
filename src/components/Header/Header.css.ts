import { style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';
import { toolbarItemSize } from '../constants';

import { sprinkles, colorPaletteVars } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const root = style([
  sprinkles({
    paddingX: 'xlarge',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  }),
  {
    height: toolbarItemSize,
    backgroundColor: colorPaletteVars.background.surface,
  },
]);

export const menuButton = style([
  {
    color: colorPaletteVars.foreground.neutral,
    selectors: {
      [comma(
        '*:hover > &',
        '*:active > &',
        '*:focus-visible > &',
        '*[data-popup-open] > &'
      )]: {
        color: colorPaletteVars.foreground.accent,
      },
    },
  },
]);

export const chevron = style({
  color: colorPaletteVars.foreground.neutral,
});

export const textField = style([
  sprinkles({
    font: 'large',
    paddingX: 'large',
    boxSizing: 'border-box',
    borderRadius: 'medium',
    textAlign: 'center',
    border: 0,
  }),
  {
    width: 'fit-content',
    color: colorPaletteVars.foreground.neutral,
    height: vars.touchableSize,
    background: colorPaletteVars.background.surface,
    '::placeholder': {
      color: colorPaletteVars.foreground.neutralSoft,
    },
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
    },
  },
]);
