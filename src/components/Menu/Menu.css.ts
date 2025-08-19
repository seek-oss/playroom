import { style } from '@vanilla-extract/css';

import { comma } from '../../css/delimiters';

import {
  minTouchableBeforePseudo,
  sharedPopupStyles,
} from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

export const trigger = style([
  sprinkles({
    boxSizing: 'border-box',
    margin: 'none',
    padding: 'none',
    userSelect: 'none',
    font: 'small',
    borderRadius: 'small',
    border: 0,
    appearance: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'medium',
    position: 'relative',
  }),
  minTouchableBeforePseudo,
  {
    background: 'transparent',
    ':focus-visible': {
      outline: `2px solid ${colorPaletteVars.outline.focus}`,
      outlineOffset: 6,
    },
  },
]);

const popupGutter = 'xsmall';
export const popup = style([
  sharedPopupStyles('small'),
  {
    width: 200,
  },
]);

export const item = style([
  sprinkles({
    position: 'relative',
    userSelect: 'none',
    font: 'standard',
    padding: 'xsmall',
  }),
  {
    color: colorPaletteVars.foreground.neutral,
    '::before': {
      content: '',
      pointerEvents: 'none',
      position: 'absolute',
      insetBlock: 0,
      insetInline: 0,
      borderRadius: vars.radii.small,
    },
    selectors: {
      [comma(
        '&[data-popup-open]:not([aria-disabled])::before',
        '&[data-highlighted]:not([aria-disabled])::before'
      )]: {
        backgroundColor: colorPaletteVars.background.selection,
      },
      [`&[aria-disabled]`]: {
        color: colorPaletteVars.foreground.secondary,
      },
    },
  },
]);

export const submenuTrigger = style([
  item,
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'xsmall',
  }),
]);

export const fieldItem = style([
  item,
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'xsmall',
  }),
]);

const fieldIndicatorSize = '16px';
export const fieldItemIndicator = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    height: fieldIndicatorSize,
    width: fieldIndicatorSize,
    color: colorPaletteVars.foreground.neutral,
  },
]);

export const menuGroupLabel = style([
  item,
  sprinkles({
    fontWeight: 'strong',
  }),
]);

export const separator = style([
  sprinkles({
    marginY: popupGutter,
    marginX: 'xxsmall',
  }),
  {
    height: 1,
    backgroundColor: colorPaletteVars.border.standard,
  },
]);
