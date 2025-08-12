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

export const positioner = style({
  outline: 0,
  zIndex: 1,
});

const popupGutter = 'xsmall';
export const popup = sharedPopupStyles('small');

const itemGutter = 'small';
export const item = style([
  sprinkles({
    userSelect: 'none',
    display: 'flex',
    font: 'standard',
    padding: 'small',
  }),
  {
    '::before': {
      content: '',
      zIndex: -1,
      position: 'absolute',
      insetBlock: 0,
      insetInline: 0,
      borderRadius: vars.radii.small,
    },
    selectors: {
      [comma('&[data-popup-open]', '&[data-highlighted]')]: {
        zIndex: 0,
        position: 'relative',
      },
      [comma('&[data-popup-open]::before', '&[data-highlighted]::before')]: {
        backgroundColor: colorPaletteVars.background.selection,
      },
    },
  },
]);

export const submenuTrigger = style([
  item,
  sprinkles({
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'medium',
  }),
]);

const fieldIndicatorSize = '16px';
export const fieldItem = style([
  item,
  sprinkles({
    alignItems: 'center',
    gap: 'xsmall',
    paddingRight: 'large',
    paddingLeft: 'xsmall',
  }),
  {
    display: 'grid',
    gridTemplateColumns: `${fieldIndicatorSize} 1fr`,
  },
]);

export const fieldItemIndicator = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    gridColumnStart: 1,
    height: fieldIndicatorSize,
    color: colorPaletteVars.foreground.neutral,
  },
]);

export const fieldItemLabel = style({
  gridColumnStart: 2,
});

export const separator = style([
  sprinkles({
    marginX: itemGutter,
    marginY: popupGutter,
  }),
  {
    height: 1,
    backgroundColor: colorPaletteVars.border.standard,
  },
]);
