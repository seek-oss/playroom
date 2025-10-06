import { createVar, globalStyle, style } from '@vanilla-extract/css';
import { calc } from '@vanilla-extract/css-utils';

import { comma } from '../../css/delimiters';

import {
  minTouchableBeforePseudo,
  sharedPopupStyles,
} from '../../css/shared.css';
import { colorPaletteVars, sprinkles } from '../../css/sprinkles.css';
import { vars } from '../../css/vars.css';

const popupGutter = 'xxsmall';
export const popup = style([
  sharedPopupStyles,
  sprinkles({ padding: 'xxsmall', borderRadius: 'medium' }),
]);

/**
 * BaseUI Menu Vars
 * See https://base-ui.com/react/components/menu#positioner
 */
const baseUIMenuVars = {
  availableHeight: 'var(--available-height)',
  availableWidth: 'var(--available-width)',
};
export const menuSizeLimit = style({
  maxHeight: baseUIMenuVars.availableHeight,
  maxWidth: baseUIMenuVars.availableWidth,
});

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
    boxSizing: 'border-box',
    padding: 'xsmall',
    gap: 'medium',
  }),
  {
    outline: 'none',
    color: colorPaletteVars.foreground.neutral,
    height: 34, // Explicit height until icons are vertically trimmed
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
      [`&:focus-visible::before`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: -2,
      },
      [`&[aria-disabled]`]: {
        color: colorPaletteVars.foreground.secondary,
        cursor: 'not-allowed',
      },
    },
  },
]);

export const itemLink = style([
  item,
  sprinkles({
    cursor: 'pointer',
  }),
  {
    textDecoration: 'none',
    selectors: {
      '&[aria-disabled]': {
        cursor: 'not-allowed',
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

export const positive = style({
  color: colorPaletteVars.foreground.positive,
  vars: {
    [highlightColor]: 'transparent',
  },
});

globalStyle(`${positive} svg`, {
  color: colorPaletteVars.foreground.positive,
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
export const radioItemIndicator = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    position: 'relative',
    height: fieldIndicatorSize,
    width: fieldIndicatorSize,
    color: 'inherit',
    zIndex: 1,
  },
]);

export const checkboxItemIndicator = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  {
    position: 'relative',
    height: fieldIndicatorSize,
    width: fieldIndicatorSize,
    color: colorPaletteVars.foreground.neutral,
    zIndex: 1,
    selectors: {
      '[aria-checked="true"] &': {
        color: colorPaletteVars.foreground.neutralInverted,
      },
    },
  },
]);

export const checkboxBox = style([
  sprinkles({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'small',
    zIndex: 1,
  }),
  {
    height: fieldIndicatorSize,
    width: fieldIndicatorSize,
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    border: `1px solid ${colorPaletteVars.foreground.neutral}`,
    isolation: 'isolate',
    selectors: {
      '[aria-checked="true"] &': {
        backgroundColor: colorPaletteVars.background.accent,
        borderColor: colorPaletteVars.background.accent,
      },
    },
  },
]);

export const menuGroupLabel = style([item]);

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
  isolation: 'isolate',
});

const clearItemPadding = 'xsmall';
export const clearItem = style([
  sprinkles({
    position: 'relative',
    display: 'block',
    textAlign: 'center',
    borderRadius: 'small',
    paddingY: clearItemPadding,
    paddingX: clearItemPadding,
  }),
  minTouchableBeforePseudo,
  {
    background: 'transparent',
    border: 'none',
    margin: calc(vars.space[clearItemPadding]).negate().toString(),
    selectors: {
      [comma('&:hover', '&[data-highlighted]')]: {
        backgroundColor: colorPaletteVars.background.selection,
      },
      [`&:focus-visible`]: {
        outline: `2px solid ${colorPaletteVars.outline.focus}`,
        outlineOffset: -2,
      },
    },
  },
]);
