import { createVar, style } from '@vanilla-extract/css';

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
export const popup = sharedPopupStyles('small');

export const small = style({
  width: 250,
});

const highlightColor = createVar();
export const item = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    vars: {
      [highlightColor]: colorPaletteVars.background.selection,
    },
    selectors: {
      [comma(
        '&[data-popup-open]:not([aria-disabled])::before',
        '&[data-highlighted]:not([aria-disabled])::before'
      )]: {
        backgroundColor: highlightColor,
      },
      [`&[aria-disabled]`]: {
        color: colorPaletteVars.foreground.secondary,
      },
    },
  },
]);

export const critical = style({
  vars: {
    [highlightColor]: colorPaletteVars.background.critical,
  },
  color: colorPaletteVars.foreground.critical,
});

export const itemLeft = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    gap: 'xsmall',
    paddingRight: 'xsmall',
  }),
  {
    isolation: 'isolate',
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

export const shortcut = style({
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: '1fr',
  alignItems: 'baseline',
  justifyItems: 'center',
});
